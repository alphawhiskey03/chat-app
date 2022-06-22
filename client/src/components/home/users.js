import { useEffect, useState } from "react";
import { Image, InputGroup, FormControl, Badge, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useQuery } from "@apollo/client";
import classnames from "classnames";
import { GET_USERS_QUERY } from "../../gql/queries";
import UserLoader from "../general/userLoader";
import {
  useMessageDispatch,
  useMessageState,
} from "../../utils/messages.utils";
import {
  sortUsers,
  lastMessageTime,
  shortenMessage,
} from "../../utils/helper.utils";
import { TbArrowBarToRight, TbArrowBarToLeft } from "react-icons/tb";
import classNames from "classnames";
const Users = ({ expandMenu, toggleMenu }) => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;
  const [userList, setUserList] = useState(users ? [...users] : []);
  const [searchTxt, setSearchTxt] = useState("");
  const mobileDevice = useMediaQuery({ query: "(max-width:912px)" });

  useEffect(() => {
    if (users) {
      setUserList(() => [...sortUsers(users)]);
    }
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
      const notRead = mp.unreadCount > 0;
      return (
        <div
          role="button"
          className={classnames(
            "user-div d-flex justify-content-sm-center justify-content-md-start bg-dark py-3",
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
          <div className={classNames("", { "user-content": !expandMenu })}>
            <p className="text-primary">{mp.username}</p>
            <div className={"user-info"}>
              <div className={"latest-message-container"}>
                <p
                  className={classNames("font-weight-light text-light", {
                    "unread-message": notRead,
                  })}
                >
                  {mp.latestMessage ? (
                    <>{shortenMessage(mp.latestMessage)} </>
                  ) : (
                    "You are now connected"
                  )}
                </p>
              </div>
              <div style={{ flexGrow: 2 }}>
                {mp.unreadCount > 0 && <Badge>{mp.unreadCount}</Badge>}
              </div>
            </div>
            <p className="text-light" style={{ fontSize: 10 }}>
              {lastMessageTime(mp.latestMessage)}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className={"toggle-btn"}>
        <Button onClick={toggleMenu}>
          {expandMenu ? <TbArrowBarToLeft /> : <TbArrowBarToRight />}
        </Button>
      </div>
      {mobileDevice ? (
        <>
          {expandMenu && (
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search..."
                onChange={(e) => setSearchTxt(e.target.value)}
                className="user-search bg-dark"
              />
            </InputGroup>
          )}
        </>
      ) : (
        <>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              onChange={(e) => setSearchTxt(e.target.value)}
              className="user-search bg-dark"
            />
          </InputGroup>
        </>
      )}
      <div className={"user-box"}>{userMarkup}</div>
    </>
  );
};

export default Users;
