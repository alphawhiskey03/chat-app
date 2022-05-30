const Message = require("../models/messages");
const User = require("../models/users");
const { PubSub, withFilter } = require("graphql-subscriptions");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const pubsub = new PubSub();
module.exports = {
  Query: {
    message: async (_, { id }, { hi }) => {
      const msg = await Message.findById(id);
      return msg;
    },
    getMessages: async (_, { from }, { user }) => {
      try {
        if (!user) throw new UserInputError("you're not authenticated");
        const fromUser = await User.findOne({ username: from });
        if (!fromUser) throw new UserInputError("No user found");
        const message = await Message.find({
          $or: [
            { from: from, to: user.username },
            { from: user.username, to: from },
          ],
        }).sort({ createdAt: -1 });
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
          from: user.username,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        const res = await newMessage.save();

        pubsub.publish("MESSAGE_CREATED", {
          messageCreated: {
            to,
            from: user.username,
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
      subscribe: withFilter(
        (_, __, { user }) => {
          if (!user) throw new AuthenticationError("Not authorized");
          return pubsub.asyncIterator("MESSAGE_CREATED");
        },
        ({messageCreated}, _, { user }) => {
          console.log("((OSS<SK")
          console.log(user.username)
          console.log(messageCreated)
          if (
            messageCreated.to === user.username ||
            messageCreated.from === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
