import { FC, MouseEventHandler } from "react";
import {
  Container,
  Text,
  Skeleton,
  HStack,
  Button,
  Link,
  Code,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

const HostnameContainer: FC<{
  hostname: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}> = ({ hostname, onClick }) => {
  const { t } = useTranslation("hostname-data");

  return (
    <Container centerContent>
      <Text>
        <b>{t("hostname-heading")}</b>
      </Text>
      <Skeleton isLoaded={!!hostname}>
        <Code>{hostname}</Code>
      </Skeleton>
      <HStack mt={5}>
        {/* <Button colorScheme={"green"} size={"sm"} onClick={onOpen}>
                  Upload custom private key
                </Button> */}
        <Button colorScheme={"red"} size={"sm"} onClick={onClick}>
          {t("regenerate-btn")}
        </Button>
        <Button colorScheme={"green"} size={"sm"}>
          <Link href={`http://${hostname}/`}>{t("visit-btn")}</Link>
        </Button>
      </HStack>
    </Container>
  );
};

export default HostnameContainer;
