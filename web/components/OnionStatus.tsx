import React, { FC } from "react";
import { Container, Text } from "@chakra-ui/react";
import { Status } from "../types/userTypes";

const OnionStatus: FC<{ status: Status }> = ({ status }) => {
  return (
    <Container centerContent>
      <Text>
        <b>Onion Status</b>
      </Text>
      <Text color={status === Status.Online ? "green" : "red"}>
        <b>{Status[status]}</b>
      </Text>
    </Container>
  );
};

export default OnionStatus;
