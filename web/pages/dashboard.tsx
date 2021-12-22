import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import Protected from "../components/Protected";
import { useAppSelector } from "../redux/store";
import { Status } from "../types/user";
import type { Response, User } from "../types/user";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import {
  Skeleton,
  Center,
  Heading,
  Text,
  Code,
  SimpleGrid,
  Container,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  AlertTitle,
  Link,
  HStack,
} from "@chakra-ui/react";

const Dashboard = () => {
  const router = useRouter();
  const token = useAppSelector((state) => state.access_token.data) as string;

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<any>();

  const [isRegenerating, setIsRegenerating] = useState(false);

  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>(Status.Offline);

  const fetchUserData = (token: string) => {
    Axios.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const data = res.data as Response<User>;
        setUsername(data.data!.Username);
        setUrl(data.data!.Address);
        setStatus(data.data!.Status);
      })
      .catch((e) => {
        if (!isServer) router.push("/login");
      });
  };

  return (
    <Protected>
      <div>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
                Regenerate your onion address
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? This can not be undone!
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isLoading={isRegenerating}
                  loadingText="Regenerating"
                  colorScheme={"red"}
                  ml={3}
                  onClick={() => {
                    setIsRegenerating(true);
                    setUrl("");
                    Axios.post(
                      "/user/onion/regenerate",
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    )
                      .then(() => {
                        fetchUserData(token);
                        setIsRegenerating(false);
                      })
                      .catch((e) => {
                        // nothing
                      });
                    onClose();
                  }}
                >
                  Regenerate
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        {fetchUserData(token)}
        <Center paddingBottom={20}>
          <Skeleton isLoaded={!!username}>
            <Heading>Welcome {username}</Heading>
          </Skeleton>
        </Center>
        <Center>
          <SimpleGrid columns={2} spacing={10}>
            <Container centerContent>
              <Text>
                <b>Onion URL</b>
              </Text>
              <Skeleton isLoaded={!!url}>
                <Code>{url}</Code>
              </Skeleton>
              <HStack mt={5}>
                <Button
                  colorScheme={"red"}
                  size={"sm"}
                  onClick={() => setIsOpen(true)}
                >
                  Regenerate
                </Button>
                <Button colorScheme={"green"} size={"sm"}>
                  <Link href={`http://${url}/`}>Visit</Link>
                </Button>
              </HStack>
            </Container>
            <Container centerContent>
              <Text>
                <b>Onion Status</b>
              </Text>
              <Text color={status === Status.Online ? "green" : "red"}>
                <b>{Status[status]}</b>
              </Text>
            </Container>
            <Container centerContent>3</Container>
            <Container centerContent>4</Container>
          </SimpleGrid>
        </Center>
      </div>
    </Protected>
  );
};

export default Dashboard;
