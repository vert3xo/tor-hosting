import { Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PageHead from "../components/PageHead";
import { useAppDispatch } from "../redux/store";
import { setToken } from "../redux/token";
import isServer from "../utils/isServer";

const Logout = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  if (!isServer) {
    dispatch(setToken(null));
    push("/");
  }

  return (
    <Center>
      <PageHead title="Log out" />
      <Heading>You are being redirected...</Heading>
    </Center>
  );
};

export default Logout;
