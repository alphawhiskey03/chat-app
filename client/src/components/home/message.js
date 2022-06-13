import { useAuthState } from "../../utils/auth.util";
import classNames from "classnames";
import moment from "moment";
import { OverlayTrigger, Tooltip, Button, Popover } from "react-bootstrap";
import { REACT_TO_MESSAGE } from "../../gql/queries";
import { useMutation } from "@apollo/client";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { useState } from "react";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const recieved = !sent;
  const [showReactions, setShowReactions] = useState(false);
  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
  const [reactToMessage] = useMutation(REACT_TO_MESSAGE,{
    onError:(err)=>console.log(err),
    onCompleted:()=>setShowReactions(false)
  });
  // const reactionIcons=[...new Set(message.message_reactions.map(r=>r.content))]

  const onReact = (reaction) => {
    reactToMessage({
      variables: {
        id: message._id,
        content: reaction,
      },
    });
  };
  const PopoverContent = (
    <Popover id="popover-basic" className="rounded-pill">
      <Popover.Body className="d-flex align-items-center reaction-icons-popover">
        {reactions.map((reaction) => (
          <Button
            variant="link"
            className="reaction-icons"
            onClick={() => onReact(reaction)}
          >
            {reaction}
          </Button>
        ))}
      </Popover.Body>
    </Popover>
  );
  const ReactionButton = (
    <OverlayTrigger
      placement="top"
      trigger="click"
      overlay={PopoverContent}
      show={showReactions}
      onToggle={() => setShowReactions(!showReactions)}
    >
      <Button variant="link" className="px-2 reaction-icons">
        <BsEmojiHeartEyes size="1.5rem" />
      </Button>
    </OverlayTrigger>
  );
  return (
    <div
      className={classNames("d-flex my-3", {
        "sent-message": sent,
        "revieved-message": recieved,
      })}
    >
      {sent && ReactionButton}

      <OverlayTrigger
        placement={sent ? "right" : "left"}
        overlay={
          <Tooltip id={`tooltip`}>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
      >
        <div
          className={classNames("py-2 px-3 mt-2 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": recieved,
          })}
        >
          {message.message_reactions.length> 0 && (
            <div className="selected-user reactions-div bg-secondary p-1 rounded-pill">
              {message.message_reactions[0].content}
            </div>
          )}
          <p className={classNames("mt-3", { "text-white": sent })}>
            {message.content} 
          </p>
        </div>
      </OverlayTrigger>
      {recieved && ReactionButton}
    </div>
  );
};

export default Message;
