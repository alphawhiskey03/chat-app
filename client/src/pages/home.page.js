import { Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {useSubscription } from "@apollo/client";
import {MESSAGE_CREATED_SUBSCRIPTION} from "../gql/queries"
import { useEffect } from "react";
import Users from "../components/home/users";
import { useAuthDispatch } from "../utils/auth.util";
import { useApolloClient } from "@apollo/client";
import Messages from "../components/home/messages";
// import { useMessageDispatch } from "../utils/messages.utils";
const Home = () => {
  const navigate = useNavigate();
  const authDispatch = useAuthDispatch();
  // const messageDispatch=useMessageDispatch();
  // const {user}=useAuthState()
  const client = useApolloClient();

  const {data,error}=useSubscription(MESSAGE_CREATED_SUBSCRIPTION)
  const logout = () => {
    authDispatch({
      type: "LOGOUT",
    });
    client.resetStore();
    navigate("/login");
  };

  useEffect(()=>{
    console.log(data,error);
    if(error){
      console.log(error)
    }
    if(data){
      console.log("hi")
      console.log(data)
    //   const message=data.messageCreated
    //   const otherUser=user.username===message.to?message.from:message.to
    //   messageDispatch({
    //     type:"ADD_MESSAGE",
    //     payload:{
    //       username:otherUser, 
    //       message
    //     }
    // })
  }
},[data,error])
  return (
    <div>
      <Row className="justify-content-center p-3">
        <Col>
          <Link style={{ textDecoration: "none" }} to="/Register">
            Register
          </Link>
        </Col>

        <Col>
          <Link style={{ textDecoration: "none" }} to="/login">
            Login
          </Link>
        </Col>

        <Col>
          <Button size="sm" onClick={logout}>
            Logout
          </Button>
        </Col>
      </Row>
      <Row className="bg-white">
          <Users />
          <Messages />
      </Row>
    </div>
  );
};

export default Home;
