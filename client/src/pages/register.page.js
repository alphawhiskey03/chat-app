import { useState } from "react";

import FormUtil from "../utils/form.utils";
import { Form, Button, Card } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REGISTER_USER_MUTATION } from "../gql/queries";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../utils/auth.util";
const Register = () => {
  const { Group, Label, Control, Text } = Form;
  const [errors, setErrors] = useState({});
  const dispatch=useAuthDispatch()
  const { onSubmit, onChange, values, clearValues } = FormUtil(formOnSubmit, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [register, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    update(_, { data: { RegisterUser: userData } }) {
      dispatch({
        type:"LOGIN",
        payload:userData
      })
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: {
      userInput: values,
    },
  });
  function formOnSubmit() {
    if (values.password !== values.confirmPassword) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        password: "Passwords dont match",
      }));
    }
    register();
  }
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 mt-4 bg-dark auth-card" style={{width:400}}>
        <Form className="mt-3" onSubmit={onSubmit}>
          <h1 className="text-white">Register</h1>

          <Group controlId="formUsername">
            <Label>Username</Label>
            <Control
              type="text"
              name="username"
              placeholder="Enter your username"
              value={values.username}
              onChange={onChange}
              className="bg-dark"

            />
            <Text
              className={
                errors && errors.username ? "text-danger" : "text-primary"
              }
            >
              {errors && errors.username
                ? errors.username
                : "usernames should always be unique"}
            </Text>
          </Group>

          <Group controlId="formEmailId">
            <Label>Email address</Label>
            <Control
              type="email"
              name="email"
              placeholder="Enter your mail"
              value={values.email}
              onChange={onChange}
              className="bg-dark"

            />
            <Text
              className={errors && errors.email ? "text-danger" : "text-primary"}
            >
              {errors && errors.email
                ? errors.email
                : "Never share email with anyone"}
            </Text>
          </Group>

          <Group controlId="formPassword">
            <Label>Password</Label>
            <Control
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={onChange}
              className="bg-dark"

            />
            <Text
              className={
                errors && errors.password ? "text-danger" : "text-primary"
              }
            >
              {errors && errors.password
                ? errors.password
                : "Must contain alphanumeric"}{" "}
            </Text>
          </Group>

          <Group controlId="formConfirmPassword">
            <Label>Confirm password</Label>
            <Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={values.confimPassword}
              onChange={onChange}
              className="bg-dark"

            />
            <Text
              className={
                errors && errors.confirmPassword ? "text-danger" : "text-primary"
              }
            >
              {" "}
              {errors && errors.confirmPassword
                ? errors.confirmPassword
                : "Should match with password"}
            </Text>
          </Group>
          <Button variant="primary text-dark" size="sm" className="mt-3" type="submit">
            {loading ? "loading..." : "Register"}
          </Button>
        </Form>
        <hr />
        <div className="text-center">
          <Button
            disabled={loading ? true : false}
            variant="outline-primary"
            size="sm"
            style={{ width: "50%" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </Card>
      </div>
  );
};

export default Register;
