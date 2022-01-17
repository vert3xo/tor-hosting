import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
import { useTranslation } from "next-i18next";
import PageHead from "../components/PageHead";

const Register = () => {
  const { t } = useTranslation("common");
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t("username-short"))
      .max(32, t("username-long"))
      .required(t("username-required")),
    password: Yup.string()
      .min(8, t("password-length"))
      .required(t("password-required")),
    password_confirm: Yup.string()
      .oneOf([Yup.ref("password")], t("password-conf-match"))
      .required(t("password-conf-required")),
  });

  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  return (
    <div>
      <PageHead title="Registration" />
      <Navbar />
      <Center flexDir="column">
        <Heading mb={8}>{t("registration")}</Heading>
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
                <FormLabel>{t("username")}</FormLabel>
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
                <FormLabel>{t("password")}</FormLabel>
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
                <FormLabel>{t("password-conf")}</FormLabel>
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
                    {props.errors.password_confirm}
                  </FormHelperText>
                ) : null}
              </FormControl>
              {errorText ? (
                <FormControl mb={4} color={"red"} fontSize={18}>
                  <FormHelperText color="red">{errorText}</FormHelperText>
                </FormControl>
              ) : null}
              <Button
                isLoading={isLoading}
                colorScheme={"blue"}
                width={"100%"}
                type="submit"
              >
                {t("sign-up")}
              </Button>
            </Form>
          )}
        </Formik>
      </Center>
    </div>
  );
};

export default Register;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "navbar-main",
      ])),
    },
  };
};
