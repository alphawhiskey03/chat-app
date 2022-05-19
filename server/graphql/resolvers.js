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
const MessageResolvers=require("./Messages.resolver")
const UserResolvers=require("./Users.resolver")
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
    ...MessageResolvers.Query,
    ...UserResolvers.Query
  },
  Mutation: {
    ...MessageResolvers.Mutation,
    ...UserResolvers.Mutation
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator("message_created"),
    },
  },
};
