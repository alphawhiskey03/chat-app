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
    message: async (_, { id }, { hi }) => {
      console.log(id);

      const msg = await Message.findById(id);
      return msg;
    },
    getMessages: async (_, { from }, { user }) => {
      try {
        console.log(from);
        if (!user) throw new UserInputError("you're not authenticated");
        const fromUser = await User.findOne({ username: from });
        if (!fromUser) throw new UserInputError("No user found");
        const message = await Message.find({
          $or: [
            { from: from, to: user.username },
            { from: user.username, to: from },
          ],
        }).sort({ createdAt: 1 });
        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { messageInput }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("You are not authenticated");
        const { to, from, content } = messageInput;
        const recepient = await User.findOne({ username: to });
        console.log(recepient);
        if (!recepient) {
          throw new UserInputError("Recepient not found");
        } else if (
          recepient.username === user.username ||
          from === recepient.username
        ) {
          throw new UserInputError("You cannot message yourself");
        }
        if (content.trim() === "") {
          throw new UserInputError("Message cannot be empty");
        }
        const newMessage = new Message({
          to,
          from,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const res = await newMessage.save();
        pubsub.publish("message_created", {
          messageCreated: {
            to,
            from,
            content,
          },
        });

        return {
          id: res.id,
          ...res._doc,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator("message_created"),
    },
  },
};
