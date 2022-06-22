import { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES_QUERY, SEND_MESSAGE_MUTATION } from "../../gql/queries";
import {
  useMessageState,
  useMessageDispatch,
} from "../../utils/messages.utils";
import Message from "./message";
import {  Form } from "react-bootstrap";
import FormUtil from "../../utils/form.utils";
import { BiSend } from "react-icons/bi";
import ToastMessage from "../general/toastMessage";
const Messages = () => {
  const { onSubmit, onChange, values, clearValues } = FormUtil(onSend, {
    message: "",
  });
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const selectedUser = users?.find((user) => user.selected === true);
  const message = selectedUser?.messages;
const [reactionOpen,setReactionOpen]=useState('')
const [showError,setShowError]=useState(false);



  const [getMessages, { loading: messegesLoading, data: messageData }] =
    useLazyQuery(GET_MESSAGES_QUERY);

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted(data){
      clearValues();
    },
    onError(err) {
      console.log(err);
    }, 
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      clearValues()
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
  // useEffect(()=>{
  //   scrollIntoBottom()
  // },[message])

  let messageMarkup;
  if (!message && !messegesLoading) {
    messageMarkup = <p className="text-primary text-center">Select a friend!</p>;
  } else if (messegesLoading) {
    messageMarkup = <p className="text-primary text-center">Loading...</p>;
  } else if (message.length > 0) {
    messageMarkup = "";
    messageMarkup = message.map((message, i) => {
      return <Message key={message._id} message={message} reactionOpen={reactionOpen} setReactionOpen={setReactionOpen} />;
    });
  } else if (message.length === 0) {
    messageMarkup = (
      <p className="text-light text-center">You're now connected send your first message</p>
    );
  }

  function onSend() {
    if (!selectedUser) return;
    sendMessage({
      variables: {
        messageInput: {
          to: selectedUser.username,
          content: values.message,
        },
      },
    });
  }
  const handleMessageAreaClick=()=>{
    if(reactionOpen.length>0){
      setReactionOpen('');
    }
  }
  const onMessageChange=(e)=>{
    if(e.target.value.length<250){
      onChange(e)
    }else{
      setShowError(true)
    }
  }


  return (
    <>
    <ToastMessage show={showError} onClose={setShowError}  messageHeader={"Oopsie"} messageBody={"The message is too long"}/>
      <div
        className={"d-flex flex-column-reverse message-box px-2 pb-3"}
      onClick={handleMessageAreaClick}
     >
        {messageMarkup}
      </div>
      <div>
        <Form onSubmit={onSubmit}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="rounded-pill bg-dark message-input"
              placeholder={`say hi to ${
                selectedUser ? selectedUser.username : "a friend"
              }`}
              name="message"
              value={values.message}
              onChange={onMessageChange}
            />
            <span className="px-1" role="button" onClick={onSubmit}>
              <BiSend size="2rem" style={{ color: "#5936c4" }} />
            </span>
          </Form.Group>
        </Form>
        <p className={"p-2"}  style={{textAlign:"center",color: "#adb5bd" }}>Copyrights 2022</p>
      </div>
    </>
  );
};

export default Messages;
