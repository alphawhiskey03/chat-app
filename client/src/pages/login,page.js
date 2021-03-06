import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import FormUtil from "../utils/form.utils";
import { useMutation } from "@apollo/client";
import { LOGIN_USER_MUTATION } from "../gql/queries";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../utils/auth.util";
const Login = () => {
  const { Group, Label, Control, Text } = Form;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const { onSubmit, onChange, values, clearValues } = FormUtil(formOnSubmit, {
    username: "",
    password: "",
  });
  const [login, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    update(_, { data: { login: userData } }) {
      dispatch({
        type: "LOGIN",
        payload: userData,
      });
      window.location.href = "/";
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: {
      loginInput: values,
    },
  });
  function formOnSubmit() {
    login();
  }
  return (
    <div className="d-flex justify-content-center align-items-center my-5">
      <Card className="p-3 mt-4 bg-dark auth-card" style={{ width: 400 }}>
        <Form className="mt-3" onSubmit={onSubmit}>
          <h1 className="text-light">Login</h1>

          <Group controlId="formUsername">
            <Label>Username</Label>
            <Control
              type="text"
              name="username"
              placeholder="Enter your username"
              values={values.username}
              onChange={onChange}
              className="bg-dark"
            />
            {errors && errors.username ? (
              <Text className="text-danger">{errors.username}</Text>
            ) : (
              ""
            )}
          </Group>

          <Group controlId="formPassword">
            <Label>Password</Label>
            <Control
              type="password"
              name="password"
              placeholder="Password"
              values={values.password}
              className="bg-dark"
              onChange={onChange}
            />
            {errors && errors.password ? (
              <Text className="text-danger">{errors.password}</Text>
            ) : (
              ""
            )}
          </Group>
          <Button
            variant="primary text-dark"
            size="sm"
            className="mt-3"
            type="submit"
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Form>
        <hr />
        <div className="text-center">
          <Button
            disabled={loading ? true : false}
            size="sm"
            variant="outline-primary"
            style={{ width: "50%" }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
