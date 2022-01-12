import { useState } from "react";
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import Navbar from "./components/Navbar";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import type { Login as LoginType } from "../../types/Login";
import { useAppDispatch } from "../../redux/store";
import { useRouter } from "next/router";
import isServer from "../../utils/isServer";
import { setToken } from "../../redux/blogToken";

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const SignInSchema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    password: Yup.string().required("Password is required!"),
  });

  const [mutateLogin, { loading, error, data }] = useMutation<LoginType>(gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `);

  if (!!data && !!data.login) {
    dispatch(setToken(data.login));
    if (!isServer) {
      router.push("/blog");
    }
    return null;
  }

  return (
    <div>
      <Navbar />
      <Center flexDir={"column"}>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={SignInSchema}
          onSubmit={(values) => {
            mutateLogin({
              variables: {
                username: values.username,
                password: values.password,
              },
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
                {props.errors.username && props.touched.username && (
                  <FormHelperText color={"red"}>
                    {props.errors.username}
                  </FormHelperText>
                )}
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
                {props.errors.password && props.touched.password && (
                  <FormHelperText color={"red"}>
                    {props.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormHelperText mb={4} color={"red"} fontSize={18}>
                  {!!error && "An error occurred!"}
                  {!loading && !!data && !data.login && "Invalid credentials!"}
                </FormHelperText>
              </FormControl>
              <Button
                isLoading={!!loading}
                colorScheme={"blue"}
                width={"100%"}
                type="submit"
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Center>
    </div>
  );
};

export default Login;
