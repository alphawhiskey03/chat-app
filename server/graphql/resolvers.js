const MessageResolvers=require("./Messages.resolver")
const UserResolvers=require("./Users.resolver")
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
    ...MessageResolvers.Subscription
  },
};
