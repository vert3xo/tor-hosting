import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
import { useTranslation } from "next-i18next";
import PageHead from "../components/PageHead";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Settings = () => {
  const token = useAppSelector((state) => state.access_token);
  !isServer && console.log(token);
  const { push } = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onDialogClose = () => setDialogOpen(false);
  const { t } = useTranslation("common");

  const passwordChangeSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, t("password-length"))
      .required(t("password-required")),
    password_confirm: Yup.string()
      .oneOf([Yup.ref("password")], t("password-conf-match"))
      .required(t("password-conf-required")),
  });

  return (
    <Protected>
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={onDialogClose}
        onConfirm={() => {
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
      />
      <PageHead title="Settings" />
      <Container>
        <Center flexDir={"column"}>
          <Heading>{t("settings")}</Heading>
          <Divider mt={4} mb={4} />
        </Center>
        <Container>
          <Heading mb={4} size={"md"}>
            {t("change-password")}
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
                  <FormLabel>{t("password")}</FormLabel>
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
                    <FormHelperText color={"red"}>
                      {props.errors.password_confirm}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <Button colorScheme={"red"} width={"100%"} type="submit">
                  {t("change-password")}
                </Button>
              </Form>
            )}
          </Formik>
          <Divider mt={4} mb={4} />
        </Container>
        <Container border={"1px solid darkred"} borderRadius={10} padding={5}>
          <Heading size={"md"}>{t("danger-zone")}</Heading>
          <Container pt={4}>
            <Flex>
              <Button
                colorScheme={"red"}
                size={"sm"}
                onClick={(e) => {
                  setDialogOpen(true);
                }}
              >
                {t("delete-account")}
              </Button>
            </Flex>
          </Container>
        </Container>
      </Container>
    </Protected>
  );
};

export default Settings;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "navbar-main",
        "confirmation-dialog",
      ])),
    },
  };
};
