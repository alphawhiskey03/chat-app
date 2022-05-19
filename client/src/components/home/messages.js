import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_MESSAGES_QUERY, GET_USERS_QUERY } from "../../gql/queries";
import {
  useMessageState,
  useMessageDispatch,
} from "../../utils/messages.utils";
import Message from "./message";
const Messages = () => {
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  console.log(users);
  const selectedUser = users?.find((user) => user.selected === true);
  console.log(selectedUser);
  const message = selectedUser?.messages;
  const [getMessages, { loading: messegesLoading, data: messageData, error }] =
    useLazyQuery(GET_MESSAGES_QUERY);
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      console.log(selectedUser);
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);
  useEffect(() => {
    if (messageData) {
      dispatch({
        type: "SET_USER_MESSAGE",
        payload: {
          username: selectedUser.username,
          messages: messageData.getMessages,
        },
      });
    }
  }, [messageData]);

  let messageMarkup;
  console.log(message);
  if (!message && !messegesLoading) {
    messageMarkup = <p>Select a friend!</p>;
  } else if (messegesLoading) {
    messageMarkup = <p>Loading...</p>;
  } else if (message.length > 0) {
    messageMarkup = message.map((message, i) => (
      <Message key={message.id} message={message} />
    ));
  } else if (message.length === 0) {
    messageMarkup = <p>You're now connected send your first message</p>;
  }

  return (
    <>
      <p>Messages</p>
      {messageMarkup}
    </>
  );
};

export default Messages;
