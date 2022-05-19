import { Row, Col, Button, Image } from "react-bootstrap";
import { useLazyQuery, useQuery } from "@apollo/client";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { GET_USERS_QUERY } from "../../gql/queries";
import {
  useMessageDispatch,
  useMessageState,
} from "../../utils/messages.utils";
const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;
  console.log(dispatch);
  const { loading } = useQuery(GET_USERS_QUERY, {
    onCompleted: (data) => {
      console.log(data.getUsers);
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
          className={classnames("user-div d-flex p-2", {
            "bg-white user-div d-flex p-2": selected,
          })}
          key={mp.username}
          onClick={(e) =>
            dispatch({ type: "SET_SELECTED_USER", payload: mp.username })
          }
        >
          <Image
            src={mp.imageUrl}
            className="m-2"
            roundedCircle
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
          <div>
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

  return <>{userMarkup}</>;
};

export default Users;
