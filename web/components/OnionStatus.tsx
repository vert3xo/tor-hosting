import React, { FC } from "react";
import { Container, Text } from "@chakra-ui/react";
import { Status } from "../types/userTypes";
import { useTranslation } from "next-i18next";

const OnionStatus: FC<{ status: Status }> = ({ status }) => {
  const { t } = useTranslation("onion-status");

  return (
    <Container centerContent>
      <Text>
        <b>{t("status-heading")}</b>
      </Text>
      <Text color={status === Status.Online ? "green" : "red"}>
        <b>{Status[status]}</b>
      </Text>
    </Container>
  );
};

export default OnionStatus;
