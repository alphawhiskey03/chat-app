import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import {
  MESSAGE_CREATED_SUBSCRIPTION,
  NEW_REACTION_SUBSCRIPTION,
  USER_CREATED_SUBSCRIPTION,
} from "../gql/queries";
import { useEffect, useState } from "react";
import Users from "../components/home/users";
import { useAuthDispatch, useAuthState } from "../utils/auth.util";
import { useApolloClient } from "@apollo/client";
import Messages from "../components/home/messages";
import { useMessageDispatch } from "../utils/messages.utils";
import { DropdownButton, Dropdown } from "react-bootstrap";
import classNames from "classnames";
const Home = () => {
  const navigate = useNavigate();
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();
  const client = useApolloClient();
  const [expandMenu, setExpandMenu] = useState(false);

  const toggleMenu = () => {
    setExpandMenu(!expandMenu);
  };

  const { data: messageData, error: messageError } = useSubscription(
    MESSAGE_CREATED_SUBSCRIPTION
  );
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION_SUBSCRIPTION
  );

  const { data: userData, error: userError } = useSubscription(
    USER_CREATED_SUBSCRIPTION
  );

  const logout = () => {
    messageDispatch({
      type: "LOGOUT",
      payload: {
        username: user.username,
      },
    });
    authDispatch({
      type: "LOGOUT",
    });

    client.resetStore();
    navigate("/login");
  };

  useEffect(() => {
    if (messageError) {
      // window.location.href="./"
      console.log(messageError);
    }
    if (messageData) {
      const message = messageData.messageCreated;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageData, messageError]);

  useEffect(() => {
    if (reactionError) {
      // window.location.href="./"
      console.log(reactionError);
    }
    if (reactionData) {
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;
      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionData, reactionError]);

  useEffect(() => {
    if (userError) {
      console.log(userError);
    }
    if (userData) {
      const user = userData.userCreated;
      messageDispatch({
        type: "ADD_USER",
        payload: {
          newUser: user,
        },
      });
    }
  }, [userData, userError]);

  return (
    <div>
      <Row className="d-flex justify-content-start p-3">
        {/* <Col>
          <Link style={{ textDecoration: "none" }} to="/Register">
            Register
          </Link>
        </Col> */}

        <Col style={{ textAlign: "right" }}>
          {/* <Link style={{ textDecoration: "none" }} to="/login">
            Login
          </Link> */}
          <DropdownButton className={"px-3"} title={user.username}>
            <Dropdown.Item eventKey="1" onClick={logout}>
              Logout
            </Dropdown.Item>
          </DropdownButton>
        </Col>

        {/* <Col>
          <Button size="sm" onClick={logout}>
            Logout
          </Button>
        </Col> */}
      </Row>
      <Row className="bg-dark pr-3 pt-2">
        <Col xs={expandMenu ? 10 : 2} md={4} style={{ padding: 0 }}>
          <Users expandMenu={expandMenu} toggleMenu={toggleMenu} />
        </Col>
        <Col
          xs={10}
          md={8}
          className={classNames("", {
            "d-none": expandMenu,
          })}
        >
          <Messages />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
