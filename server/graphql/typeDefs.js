const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    message(id: ID!): Message
    getUsers: [User]!
    getMessages(from: String!): [Message]!
  }
  type Reaction {
    _id: ID!
    content: String!
    message: Message!
    user: User!
  }

  type Message {
    _id: ID!
    to: String!
    from: String!
    content: String
    read:Boolean
    createdAt: String!
    message_reactions:[Reaction]!
  }
 
  type User {
    id: ID!
    username: String!
    email: String!
    imageUrl: String
    token: String!
    latestMessage: Message
    unreadCount:Int
  }

  input LoginInput {
    username: String!
    password: String!
  }
  input MessageInput {
    to: String!
    content: String!
  }
  input UserInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type Mutation {
    RegisterUser(userInput: UserInput!): User!
    login(loginInput: LoginInput!): User!
    sendMessage(messageInput: MessageInput!): Message!
    reactToMessage(id: String!, content: String!): Reaction!
    setAsRead(id:String!):Message!
  }
  type Subscription {
    messageCreated: Message!
    newReaction:Reaction!
    userCreated:User!
  }
`;
