import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import { useRouter } from "next/dist/client/router";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useAppDispatch } from "../redux/store";
import { setToken } from "../redux/token";
import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

const Login = () => {
  const { t } = useTranslation("common");

  const SigninSchema = Yup.object().shape({
    username: Yup.string().required(t("username-required")),
    password: Yup.string().required(t("password-required")),
  });

  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const dispatch = useAppDispatch();

  return (
    <div>
      <Navbar />
      <Center flexDir="column">
        <Heading mb={8}>{t("log-in")}</Heading>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={SigninSchema}
          onSubmit={(values) => {
            setLoading(true);

            Axios.post(
              "/login",
              {
                username: values.username,
                password: values.password,
              },
              { withCredentials: true }
            )
              .then((res) => {
                dispatch(setToken(res.data.data.access_token));
                if (!isServer) {
                  router.push("/dashboard");
                }
              })
              .catch((e: AxiosError) => {
                setLoading(false);
                if (!e.response || !e.response.data.error) {
                  setErrorText("An error occurred!");
                } else {
                  setErrorText(e.response.data.error);
                }
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
                  <FormHelperText mb={4} color={"red"}>
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
                  <FormHelperText mb={4} color={"red"}>
                    {props.errors.password}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl>
                <FormHelperText mb={4} color={"red"} fontSize={18}>
                  {errorText}
                </FormHelperText>
              </FormControl>
              <Button
                isLoading={isLoading}
                colorScheme={"blue"}
                width={"100%"}
                type="submit"
              >
                {t("sign-in")}
              </Button>
            </Form>
          )}
        </Formik>
      </Center>
    </div>
  );
};

export default Login;

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
