import { useEffect ,useRef} from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES_QUERY, SEND_MESSAGE_MUTATION } from "../../gql/queries";
import {
  useMessageState,
  useMessageDispatch,
} from "../../utils/messages.utils";
import Message from "./message";
import { Col, Form } from "react-bootstrap";
import FormUtil from "../../utils/form.utils";
import { BiSend } from "react-icons/bi";
const Messages = () => {
  const { onSubmit, onChange, values, clearValues } = FormUtil(onSend, {
    message: "",
  });
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const messageEndRef=useRef(null)
  const selectedUser = users?.find((user) => user.selected === true);
  const message = selectedUser?.messages;
  const [getMessages, { loading: messegesLoading, data: messageData, error }] =
    useLazyQuery(GET_MESSAGES_QUERY);

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE_MUTATION, {
    onError(err) {
      console.log(err);
    },
  });

  const scrollIntoBottom=()=>{
    messageEndRef.current?.scrollIntoView({behavior:"smooth"})
  }
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
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
    messageMarkup = <p className="info-text">Select a friend!</p>;
  } else if (messegesLoading) {
    messageMarkup = <p className="info-text">Loading...</p>;
  } else if (message.length > 0) {
    messageMarkup = message.map((message, i) => (
      <Message key={message.id} message={message} />
    ));
  } else if (message.length === 0) {
    messageMarkup = (
      <p className="info-text">You're now connected send your first message</p>
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
    clearValues();
  }

  return (
    <Col xs={10} md={8}>
      <div className={"d-flex flex-column-reverse message-box"}>{messageMarkup}<div ref={messageEndRef}/></div>
      <div>
        <Form onSubmit={onSubmit} >
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="rounded-pill bg-secondary message-input"
              placeholder={`say hi to ${
                selectedUser ? selectedUser.username : "a friend"
              }`}
              name="message"
              value={values.message}
              onChange={onChange}
            />
            <span className="px-1" role="button" onClick={onSubmit}>
            <BiSend size="2rem" style={{color:"#0d6efd"}}/>
            </span>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
