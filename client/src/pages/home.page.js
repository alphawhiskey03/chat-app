import { Row, Col, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import Users from "../components/home/users";
import { useAuthDispatch } from "../utils/auth.util";
import { useApolloClient } from "@apollo/client";
import Messages from "../components/home/messages";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const client = useApolloClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    client.resetStore();
    navigate("/login");
  };

  return (
    <div style={{ background: "black" }}>
      <Row className="p-3 justify-content-center">
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
      <Row className="bg-white" style={{ borderRadius: "35px 35px 0 0" }}>
        <Col
          xs={4}
          className="p-0 bg-secondary"
          style={{ borderRight: "1px solid grey" }}
        >
          <Users />
        </Col>
        <Col xs={6}>
          <Messages />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
