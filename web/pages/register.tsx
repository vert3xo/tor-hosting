import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Center } from "@chakra-ui/layout";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Form } from "formik";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username too short!")
    .max(32, "Username too long!")
    .required("Username is required!"),
  password: Yup.string()
    .min(8, "Password needs to be at least 8 characters long!")
    .required("Password is required!"),
  password_confirm: Yup.string()
    .min(8, "Password needs to be at least 8 characters long!")
    .required("Password confirmation is required!"),
});

const Register = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  return (
    <div>
      <Navbar />
      <Center flexDir="column">
        <Heading mb={8}>Registration</Heading>
        <Formik
          initialValues={{ username: "", password: "", password_confirm: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            setLoading(true);
            if (values.password !== values.password_confirm) {
              setErrorText("Passwords don't match!");
              setLoading(false);
              return;
            }

            Axios.post("/register", {
              username: values.username,
              password: values.password,
            })
              .then((res) => {
                if (!isServer) {
                  router.push("/login");
                }
              })
              .catch((e) => {
                setLoading(false);
                setErrorText(e.response.data.error || "An error occurred!");
              });
          }}
        >
          {(props) => (
            <Form style={{ width: "30%" }}>
              <FormControl mb={4} id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={props.values.username}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {props.errors.username && props.touched.username ? (
                  <FormHelperText color="red">
                    {props.errors.username}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl mb={4} id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={props.values.password}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {props.errors.password && props.touched.password ? (
                  <FormHelperText color="red">
                    {props.errors.password}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl mb={4} id="password_confirm">
                <FormLabel>Password confirmation</FormLabel>
                <Input
                  type="password"
                  name="password_confirm"
                  value={props.values.password_confirm}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {props.errors.password_confirm &&
                props.touched.password_confirm ? (
                  <FormHelperText color="red">
                    {props.errors.password}
                  </FormHelperText>
                ) : null}
              </FormControl>
              {errorText ? (
                <FormControl mb={4}>
                  <FormHelperText color="red">{errorText}</FormHelperText>
                </FormControl>
              ) : null}
              <Button
                isLoading={isLoading}
                colorScheme={"pink"}
                width={"100%"}
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
      </Center>
    </div>
  );
};

export default Register;
