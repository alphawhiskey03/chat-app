import { useEffect, useState } from "react";
import { Col, Image, InputGroup, FormControl } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import classnames from "classnames";
import { GET_USERS_QUERY } from "../../gql/queries";
import UserLoader from "../general/userLoader";
import {
  useMessageDispatch,
  useMessageState,
} from "../../utils/messages.utils";
import { sortUsers ,lastMessageTime} from "../../utils/helper.utils";
const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;
  const [userList, setUserList] = useState(users?[...users]:[]);
  const [searchTxt, setSearchTxt] = useState("");

  useEffect(() => {

    if(users){
    setUserList(() =>[
      ...sortUsers(users)
        ]);
    }
    // setUserList(users);
  }, [JSON.stringify(users)]);

  useEffect(() => {
    if (searchTxt.length) {
      setUserList((usrList) =>
        usrList.filter((ul) => ul.username.includes(searchTxt))
      );
    } else {
      setUserList(users);
    }
  }, [searchTxt, users]);
  const { loading } = useQuery(GET_USERS_QUERY, {
    onCompleted: (data) => {
      dispatch({
        type: "SET_USERS",
        payload: [...data.getUsers],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  let userMarkup;
  if (!userList || loading) {
    userMarkup = <UserLoader />;
  } else if (userList.length === 0) {
    userMarkup = <p>No users found.</p>;
  } else if (userList.length > 0) {
    userMarkup = userList.map((mp) => {
      const selected = selectedUser === mp.username;
      return (
        <div
          role="button"
          className={classnames(
            "user-div d-flex justify-content-center justify-content-md-start bg-dark py-3",
            {
              "selected-user user-div d-flex": selected,
            }
          )}
          key={mp.username}
          onClick={(e) =>
            dispatch({ type: "SET_SELECTED_USER", payload: mp.username })
          }
          style={{
            overflowX: "hide",
            overflowY: "scroll",
            width: "10px !important",
          }}
        >
          <Image src={mp.imageUrl} className="user-image m-2" roundedCircle />
          <div className="user-content">
            <p className="text-primary">{mp.username}</p>
            <p className="font-weight-light text-light">
              {mp.latestMessage
                ? mp.latestMessage.content
                : "You are now connected"}
            </p>
            <p className="text-light" style={{fontSize:10}}>{lastMessageTime(mp.latestMessage)}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col xs={2} md={4} style={{ padding: 0 }}>
      {" "}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search..."
          onChange={(e) => setSearchTxt(e.target.value)}
          className="user-search bg-dark"
        />
      </InputGroup>{" "}
      <div style={{ overflowY: "scroll", height: 600 ,transition:"0.5s fade-in"}}>{userMarkup}</div>
    </Col>
  );
};

export default Users;
