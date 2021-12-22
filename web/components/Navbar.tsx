import { Flex, Stack, Box, Text, Spacer } from "@chakra-ui/layout";
import Link from "next/link";
import { Button } from "@chakra-ui/button";
import { FC } from "react";
import isServer from "../utils/isServer";
import { useAppSelector } from "../redux/store";

const Navbar: FC<{}> = () => {
  const authenticated = true;
  const token = useAppSelector((state) => state.access_token.data);

  return (
    <Box mt={4} mb={8} borderBottom={"2px solid gray"} width={"100vw"}>
      <Flex width={"100%"}>
        <Flex>
          <Button ml={4} variant="link">
            <Link href="/">Home</Link>
          </Button>
          <Button ml={4} variant="link">
            <Link href="/about">About</Link>
          </Button>
        </Flex>
        <Spacer />
        <Flex mb={4}>
          {!isServer && !token ? (
            <>
              <Button mr={4}>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button mr={4} colorScheme="pink">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button mr={4} colorScheme="pink">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button mr={4} variant="link">
                <Link href="/logout">Log out</Link>
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
