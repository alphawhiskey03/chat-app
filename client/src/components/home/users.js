import { Col, Image } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import classnames from "classnames";
import { GET_USERS_QUERY } from "../../gql/queries";
import {
  useMessageDispatch,
  useMessageState,
} from "../../utils/messages.utils";
const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;
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
  if (!users || loading) {
    userMarkup = <p>Loading...</p>;
  } else if (users.length === 0) {
    userMarkup = <p>No one joined the chat.</p>;
  } else if (users.length > 0) {
    userMarkup = users.map((mp) => {
      const selected = selectedUser === mp.username;
      return (
        <div
          role="button"
          className={classnames("user-div d-flex justify-content-center justify-content-md-start bg-secondary", {
            "bg-white user-div d-flex": selected,
          })}
          key={mp.username}
          onClick={(e) =>
            dispatch({ type: "SET_SELECTED_USER", payload: mp.username })
          }
          style={
            {
              overflowX:"hide",
              width:"10px !important",
            }
          }
        >
          <Image
            src={mp.imageUrl}
            className="user-image m-2"
            roundedCircle
          />
          <div className="user-content">
            <p className="text-success">{mp.username}</p>
            <p className="font-weight-light">
              {mp.latestMessage
                ? mp.latestMessage.content
                : "You are now connected"}
            </p>
          </div>
        </div>
      );
    });
  }

  return <Col xs={2} md={4}>{userMarkup}</Col>;
};

export default Users;
