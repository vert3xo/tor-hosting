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

const HostnameContainer: FC<{
  hostname: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}> = ({ hostname, onClick }) => {
  return (
    <Container centerContent>
      <Text>
        <b>Onion URL</b>
      </Text>
      <Skeleton isLoaded={!!hostname}>
        <Code>{hostname}</Code>
      </Skeleton>
      <HStack mt={5}>
        {/* <Button colorScheme={"green"} size={"sm"} onClick={onOpen}>
                  Upload custom private key
                </Button> */}
        <Button colorScheme={"red"} size={"sm"} onClick={onClick}>
          Regenerate
        </Button>
        <Button colorScheme={"green"} size={"sm"}>
          <Link href={`http://${hostname}/`}>Visit</Link>
        </Button>
      </HStack>
    </Container>
  );
};

export default HostnameContainer;
