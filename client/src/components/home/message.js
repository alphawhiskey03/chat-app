const Message = ({ message }) => {
  return (
    <div className="py-3 px-3 rounded-pill bg-primary">
      <p>{message.content}</p>
    </div>
  );
};

export default Message;
