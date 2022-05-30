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
      from
      to
      content
      createdAt
    }
  }
`;

export const SEND_MESSAGE_MUTATION=gql`
mutation($messageInput: MessageInput!){
  sendMessage(messageInput:$messageInput){
    to
    from 
    content
  }
}
`;


export const MESSAGE_CREATED_SUBSCRIPTION=gql`
subscription{
  messageCreated {
    content
    to
    from
  }
}
`