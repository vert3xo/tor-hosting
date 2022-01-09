import {
  Center,
  Container,
  Divider,
  Heading,
  Button,
  Flex,
  useToast,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Protected from "../components/Protected";
import { useAppSelector } from "../redux/store";
import { errorToast, successToast } from "../types/toast";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import * as Yup from "yup";

const Settings = () => {
  const token = useAppSelector((state) => state.access_token);
  !isServer && console.log(token);
  const { push } = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  //   const [errorText, setErrorText] = useState("")

  const passwordChangeSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password needs to be at least 8 characters long!")
      .required("Password is required!"),
    password_confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match!")
      .required("Password confirmation is required!"),
  });

  return (
    <Protected>
      <Container>
        <Center flexDir={"column"}>
          <Heading>Settings</Heading>
          <Divider mt={4} mb={4} />
        </Center>
        <Container>
          <Heading mb={4} size={"md"}>
            Change password
          </Heading>
          <Formik
            initialValues={{ password: "", password_confirm: "" }}
            validationSchema={passwordChangeSchema}
            onSubmit={(values) => {
              setLoading(true);

              if (!isServer) {
                Axios.post(
                  "/user",
                  { password: values.password },
                  {
                    headers: {
                      Authorization: `Bearer ${token.data}`,
                    },
                  }
                )
                  .then(() => {
                    toast({
                      ...successToast,
                      description: "Password changed.",
                    });
                    setLoading(false);
                  })
                  .catch((e) => {
                    toast({
                      ...errorToast,
                      description: "Password change failed.",
                    });
                    setLoading(false);
                  });
              }
            }}
          >
            {(props) => (
              <Form>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={props.values.password}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  {props.errors.password && props.touched.password ? (
                    <FormHelperText color={"red"}>
                      {props.errors.password}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl mb={4}>
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
                    <FormHelperText color={"red"}>
                      {props.errors.password_confirm}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <Button colorScheme={"red"} width={"100%"} type="submit">
                  Change password
                </Button>
              </Form>
            )}
          </Formik>
          <Divider mt={4} mb={4} />
        </Container>
        <Container border={"1px solid darkred"} borderRadius={10} padding={5}>
          <Heading size={"md"}>Danger zone</Heading>
          <Container pt={4}>
            <Flex>
              <Button
                colorScheme={"red"}
                size={"sm"}
                onClick={(e) => {
                  if (!isServer) {
                    Axios.delete("/user", {
                      headers: {
                        Authorization: `Bearer ${token.data}`,
                      },
                    })
                      .then(() => {
                        toast({
                          ...successToast,
                          description: "Account has been deleted.",
                        });
                        push("/logout");
                      })
                      .catch((e) => {
                        toast({
                          ...errorToast,
                          description: "Account could not be deleted.",
                        });
                      });
                  }
                }}
              >
                Delete account
              </Button>
            </Flex>
          </Container>
        </Container>
      </Container>
    </Protected>
  );
};

export default Settings;
