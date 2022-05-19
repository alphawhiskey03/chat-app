const bcrypt = require("bcrypt");
const Message = require("../models/messages");
const User = require("../models/users");
const {
  validateRegisterUser,
  validateLoginUser,
} = require("../utils/validators.utils");
const { PubSub } = require("graphql-subscriptions");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");
const { off } = require("../models/messages");

const generateToken = async (username, email, id) => {
  const token = jwt.sign(
    {
      email,
      username,
      id,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};
const pubsub = new PubSub();
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("You are not Authenticated");
        let users = await User.aggregate([
          {
            $lookup: {
              from: "messages",
              localField: "username",
              foreignField: "to",
              as: "sentMessages",
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "username",
              foreignField: "from",
              as: "recievedMessages",
            },
          },
          {
            $project: {
              id: "$_id",
              username: 1,
              imageUrl: 1,
              latestMessage: {
                $concatArrays: ["$sentMessages", "$recievedMessages"],
              },
            },
          },
          {
            $match: { username: { $not: { $eq: user.username } } },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ]);
        users = users.map((newus) => {
          const temp = newus.latestMessage[newus.latestMessage.length - 1];
          if (
            temp &&
            (temp.from === user.username || temp.to === user.username)
          ) {
            latestMessage = temp;
            newus.latestMessage = latestMessage;
          } else delete newus.latestMessage;
          return newus;
        });
        console.log(users);
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    RegisterUser: async (
      _,
      { userInput: { username, email, password, confirmPassword } },
      context
    ) => {
      const { errors, valid } = validateRegisterUser(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }
      const usernameExists = await User.findOne({ username });
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errors.email = "Email already taken";
        throw new UserInputError("Invalid email", { errors });
      }
      if (usernameExists) {
        errors.username = "Username is already taken";
        throw new UserInputError("Invalid username", { errors });
      }

      if (password !== confirmPassword) {
        errors.password = "the passwords don't match";
        throw new UserInputError("Invalid password", { errors });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res.username, res.email, res._id);

      return {
        id: res.id,
        username: res.username,
        email: res.email,
        token,
      };
    },
    login: async (_, { loginInput: { username, password } }, context) => {
      const { errors, valid } = validateLoginUser(username, password);
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.username = "the username doesn't exists";
        throw new AuthenticationError("user not found", { errors });
      }
      const passwordIsCorrect = await bcrypt.compare(password, user.password);
      if (!passwordIsCorrect) {
        errors.password = "the password is incorrect";
        throw new AuthenticationError("password is incorrect", { errors });
      }
      const token = generateToken(user.username, user.email, user.id);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      };
    },
  },
};
