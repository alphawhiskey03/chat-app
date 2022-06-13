import { Placeholder, Image } from "react-bootstrap";

const UserLoader = () => {
  return (
    <>
      {[1, 2,4,3, 5].map((mp) => (
        <div
          className={
            "user-div d-flex justify-content-center justify-content-md-start bg-dark py-3"
          }
          key={1}
          style={{
            overflowX: "hide",
            overflowY: "scroll",
            width: "10px !important",
          }}
        >
          <Image src={"user.webp"} className="user-image m-2" roundedCircle />
          <div className="user-content">
            <p className="text-primary">
              {" "}
              <Placeholder
                className="rounded-pill"
                style={{ width: 120 }}
                xs={12}
                size="lg"
              />
            </p>
            <p className="font-weight-light text-light">
              <Placeholder
                className="rounded-pill"
                style={{ width: 100 }}
                xs={12}
                size="xs"
              />{" "}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
export default UserLoader;
