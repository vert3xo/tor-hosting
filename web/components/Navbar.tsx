import { Flex, Box, Spacer } from "@chakra-ui/layout";
import Link from "next/link";
import { Button } from "@chakra-ui/button";
import { FC, useState } from "react";
import isServer from "../utils/isServer";
import { useAppSelector } from "../redux/store";
import ColorThemeChanger from "./ColorThemeChanger";
import { Axios } from "../utils/axiosUtil";
import { User } from "../types/user";

const Navbar: FC<{}> = () => {
  const token = useAppSelector((state) => state.access_token.data);
  const [isAdmin, setIsAdmin] = useState(false);

  Axios.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      const data: User = res.data.data;

      setIsAdmin(data.Admin);
    })
    .catch((e) => {
      // nothing, maybe assert false in `isAdmin`
      setIsAdmin(false);
    });

  return (
    <Box mt={4} mb={8} borderBottom={"2px solid gray"} width={"100vw"}>
      <Flex width={"100%"}>
        <Flex>
          <Button ml={4} variant={"link"}>
            <Link href="/">Home</Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/about">About</Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/blog">Blog</Link>
          </Button>
          <ColorThemeChanger />
        </Flex>
        <Spacer />
        <Flex mb={4}>
          {!isServer && !token ? (
            <>
              <Button mr={4} variant={"link"}>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button mr={4} variant={"link"}>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button mr={4} variant={"link"}>
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
