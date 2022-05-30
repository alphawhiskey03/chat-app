import { useAuthState } from "../../utils/auth.util";
import classNames from "classnames";
import moment from "moment"
import { OverlayTrigger,Tooltip } from "react-bootstrap";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;
  return (

      <div
        className={classNames("d-flex my-3", {
          "sent-message": sent,
          "revieved-message": recieved,
        })}
      >
    <OverlayTrigger
    key={"top"}
    placement={sent?"right":"left"}
    overlay={
      <Tooltip id={`tooltip`}>
        {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
      </Tooltip>
    }
    >
        <div
          className={classNames("py-2 px-3 mt-2 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": recieved,
          })}
        >

          <p className={classNames("mt-3", { "text-white": sent })}>
            {message.content}
          </p>

        </div>
        </OverlayTrigger>

      </div>
  );
};

export default Message;
