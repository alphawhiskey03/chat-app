import { gql } from "@apollo/client";

export const REGISTER_USER_MUTATION = gql`
  mutation ($userInput: UserInput!) {
    RegisterUser(userInput: $userInput) {
      email
      username
      token
    }
  }
`;

export const LOGIN_USER_MUTATION = gql`
  mutation ($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      username
      token
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query {
    getUsers {
      id
      username
      imageUrl
      latestMessage {
        from
        to
        content
        createdAt
      }
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query ($from: String!) {
    getMessages(from: $from) {
      _id
      from
      to
      content
      createdAt
      message_reactions {
        _id
        content
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation ($messageInput: MessageInput!) {
    sendMessage(messageInput: $messageInput) {
      to
      from
      content
      _id
    }
  }
`;

export const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription {
    messageCreated {
      content
      to
      from
      _id
    }
  }
`;

export const REACT_TO_MESSAGE = gql`
  mutation ($id: String!, $content: String!) {
    reactToMessage(id: $id, content: $content) {
      content
      message {
        from
        to
        content
        _id
      }
    }
  }
`;

export const NEW_REACTION_SUBSCRIPTION = gql`
  subscription {
    newReaction {
      content
      _id
      message {
        from
        to
        _id
      }
    }
  }
`;
