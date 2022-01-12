import { Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { setToken } from "../../redux/blogToken";
import { useAppDispatch } from "../../redux/store";
import isServer from "../../utils/isServer";

const Logout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  dispatch(setToken(null));

  if (!isServer) {
    router.push("/blog");
  }

  return (
    <Center>
      <Heading>Redirecting you...</Heading>
    </Center>
  );
};

export default Logout;
