const MessageResolvers=require("./Messages.resolver")
const UserResolvers=require("./Users.resolver")
const User=require("../models/users")
const Message=require("../models/messages")
module.exports = {
  Reaction:{
    message:async (parent)=>await Message.findOne({_id:parent.message})
    ,
    user:async(parent)=> await User.findOne({_id:parent.user})
  }
  ,
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
