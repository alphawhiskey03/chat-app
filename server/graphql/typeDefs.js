const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    message(id: ID!): Message
    getUsers: [User]!
    getMessages(from: String!): [Message]!
  }
  type Message {
    id: ID!
    to: String!
    from: String!
    content: String
    createdAt: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    imageUrl: String
    token: String!
    latestMessage: Message
  }

  input LoginInput {
    username: String!
    password: String!
  }
  input MessageInput {
    to: String!
    from: String!
    content: String!
  }
  input UserInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type Mutation {
    sendMessage(messageInput: MessageInput!): Message!
    RegisterUser(userInput: UserInput!): User!
    login(loginInput: LoginInput!): User!
  }
  type Subscription {
    messageCreated: Message!
  }
`;
