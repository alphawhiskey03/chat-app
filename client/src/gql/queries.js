import { gql } from "@apollo/client";

// QUERY

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
      unreadCount
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query ($from: String!) {
    getMessages(from: $from) {
      _id
      from
      to
      read
      content
      createdAt
      message_reactions {
        _id
        content
      }
    }
  }
`;

// MUTATIONS

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

export const SEND_MESSAGE_MUTATION = gql`
  mutation ($messageInput: MessageInput!) {
    sendMessage(messageInput: $messageInput) {
      to
      from
      read
      content
      _id
      createdAt
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

export const SET_AS_READ_MUTATION = gql`
  mutation ($setAsReadId: String!) {
    setAsRead(id: $setAsReadId) {
      _id
      read
      from 
      to
    }
  }
`;

// Subscriptions

export const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription {
    messageCreated {
      content
      to
      read
      from
      _id
      createdAt
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

export const USER_CREATED_SUBSCRIPTION=gql`
subscription{
  userCreated{
    id
    username
    imageUrl
    latestMessage{
      _id
    }
    unreadCount
  }
}
`
