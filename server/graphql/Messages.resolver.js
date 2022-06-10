const Message = require("../models/messages");
const User = require("../models/users");
const { PubSub, withFilter } = require("graphql-subscriptions");
const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
const Reactions = require("../models/reactions");
const { convertNodeHttpToRequest } = require("apollo-server-core");
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
        // const message = await Message.find({
        //   $or: [
        //     { from: from, to: user.username },
        //     { from: user.username, to: from },
        //   ],
        // }).sort({ createdAt: -1 });
        const message = await Message.aggregate([
          { $addFields: { message_id: { $toString: "$_id" } } },
          {
            $lookup: {
              from: "reactions",
              localField: "message_id",
              foreignField: "messageId",
              as: "message_reactions",
            },
          },
          {
            $match: {
              $or: [
                { from: from, to: user.username },
                { from: user.username, to: from },
              ],
            },
          },
          {
            $sort:{
              createdAt:-1
            }
          }
        ]);
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
            _id:res._id
          },
        });

        return {
          _id: res._id,
          ...res._doc,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    reactToMessage: async (_, { id, content }, { user }) => {
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
      try {
        if (!reactions.includes(content)) {
          throw new UserInputError("Invalid reaction");
        }
        const username = user ? user.username : "";
        user = await User.findOne({ username });
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
        const message = await Message.findOne({ _id: id });
        if (!message) {
          throw UserInputError("The message doesn't exist");
        }

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError("You're not allowed to do this");
        }
        const reaction = await Reactions.findOneAndUpdate(
          {
            messageId: id,
          },
          {
            content,
            userId: user._id,
            createdAt: new Date().toISOString(),
          },
          { upsert: true,returnDocument:"after" },
        );
        console.log(reaction)
        let res = {
          _id:reaction._id,
          content: reaction.content,
          message: reaction.messageId,
          user: reaction.userId,
          createdAt: reaction.createdAt,
        };
        console.log(res)
        pubsub.publish("NEW_REACTION", { newReaction: res });
        return res;
      } catch (err) {
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
        ({ messageCreated }, _, { user }) => {
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
    newReaction: {
      subscribe: withFilter(
        (_, __, { user }) => {
          if (!user) throw new AuthenticationError("Not authorized");
          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await Message.findOne({ _id: newReaction.message });
          if (message.to === user.username || message.from === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
