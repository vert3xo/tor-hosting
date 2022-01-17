import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql, useMutation } from "@apollo/client";
import {
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
  FormHelperText,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import type { Register as RegisterType } from "../../types/Register";
import isServer from "../../utils/isServer";
import Navbar from "./components/Navbar";
import { useTranslation } from "next-i18next";

const Register = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username too short!")
      .max(32, "Username too long!")
      .required("Username is required!"),
    name: Yup.string().required("Name is required!"),
    password: Yup.string()
      .min(8, "Password is too short!")
      .required("Password is required!"),
    password_confirm: Yup.string()
      .min(8, "Password is too short!")
      .oneOf([Yup.ref("password")], "Password do not match!")
      .required("Password confirmation is required!"),
  });

  const [mutateRegister, { loading, error, data }] =
    useMutation<RegisterType>(gql`
      mutation Register(
        $username: String!
        $name: String!
        $password: String!
      ) {
        register(username: $username, name: $name, password: $password)
      }
    `);

  if (!!data && data.register) {
    if (!isServer) {
      router.push("/blog/login");
    }
  }

  return (
    <div>
      <Navbar />
      <Center flexDirection={"column"}>
        <Heading mb={8}>{t("registration")}</Heading>
        <Formik
          initialValues={{
            username: "",
            name: "",
            password: "",
            password_confirm: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={(values) => {
            mutateRegister({
              variables: {
                username: values.username,
                name: values.name,
                password: values.password,
              },
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
                {!!props.errors.username && !!props.touched.username && (
                  <FormHelperText>{props.errors.username}</FormHelperText>
                )}
              </FormControl>
              <FormControl mb={4} id="name">
                <FormLabel>{t("name")}</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {!!props.errors.name && !!props.touched.name && (
                  <FormHelperText>{props.errors.name}</FormHelperText>
                )}
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
                {!!props.errors.password && !!props.touched.password && (
                  <FormHelperText>{props.errors.password}</FormHelperText>
                )}
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
                {!!props.errors.password_confirm &&
                  !!props.touched.password_confirm && (
                    <FormHelperText>
                      {props.errors.password_confirm}
                    </FormHelperText>
                  )}
              </FormControl>
              <FormControl>
                <FormHelperText mb={4} color={"red"} fontSize={18}>
                  {!!error || (!!data && !data.register)
                    ? "An error occurred!"
                    : ""}
                </FormHelperText>
              </FormControl>
              <Button
                isLoading={loading}
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
