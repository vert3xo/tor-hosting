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
  SimpleGrid,
  Container,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import FormData from "form-data";
import { errorToast, successToast } from "../types/toast";
import UploadContent from "../components/UploadContent";
import OnionStatus from "../components/OnionStatus";
import HostnameContainer from "../components/HostnameContainer";

const Dashboard = () => {
  const router = useRouter();
  const token = useAppSelector((state) => state.access_token.data) as string;

  const [alertOpen, setAlertOpen] = useState(false);
  const onAlertClose = () => setAlertOpen(false);
  const cancelRef = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalFocusRef = useRef<any>();

  const [isRegenerating, setIsRegenerating] = useState(false);

  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>(Status.Offline);

  const [file, setFile] = useState<File | null>(null);

  const toast = useToast();

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
        <Modal finalFocusRef={modalFocusRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Private key upload</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <Input
                  border={"none"}
                  type={"file"}
                  onChange={(e) => {
                    if (!!e.target.files && e.target.files.length !== 0)
                      setFile(e.target.files[0]);
                  }}
                />
                <Button
                  type="submit"
                  size={"sm"}
                  colorScheme={"green"}
                  mr={5}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!!file) {
                      const data = new FormData();
                      data.append("key", file);
                      Axios.post("/user/onion/upload", data, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      })
                        .then((res) => {
                          setFile(null);
                        })
                        .catch((e) => {
                          toast({
                            ...errorToast,
                            description: "Key upload failed!",
                          });
                        });
                    }
                  }}
                >
                  Upload
                </Button>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={"red"} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={alertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertClose}
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
                <Button ref={cancelRef} onClick={onAlertClose}>
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
                        toast({
                          ...successToast,
                          description:
                            "Your .onion hostname has been regenerated.",
                        });
                      })
                      .catch((e) => {
                        toast({
                          ...errorToast,
                          description:
                            "Regenerating your .onion hostname failed!",
                        });
                      });
                    setIsRegenerating(false);
                    onAlertClose();
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
            <HostnameContainer
              onClick={() => setAlertOpen(true)}
              hostname={url}
            />
            <OnionStatus status={status} />
            <UploadContent token={token} />
            <Container centerContent>4</Container>
          </SimpleGrid>
        </Center>
      </div>
    </Protected>
  );
};

export default Dashboard;
