import { Flex, Box, Spacer } from "@chakra-ui/layout";
import Link from "next/link";
import { Button } from "@chakra-ui/button";
import { FC, useState } from "react";
import isServer from "../utils/isServer";
import { useAppSelector } from "../redux/store";
import ColorThemeChanger from "./ColorThemeChanger";
import { Axios } from "../utils/axiosUtil";
import { User } from "../types/userTypes";
import { useTranslation } from "next-i18next";
import LocaleChanger from "./LocaleChanger";

const Navbar: FC = () => {
  const token = useAppSelector((state) => state.access_token.data);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation("navbar-main");

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
            <Link href="/">{t("home")}</Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/about">{t("about")}</Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/blog">{t("blog")}</Link>
          </Button>
          <ColorThemeChanger />
          <LocaleChanger />
        </Flex>
        <Spacer />
        <Flex mb={4}>
          {!isServer && !token ? (
            <>
              <Button mr={4} variant={"link"}>
                <Link href="/login">{t("sign-in")}</Link>
              </Button>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/register">{t("sign-up")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/dashboard">{t("dashboard")}</Link>
              </Button>
              {isAdmin && (
                <Button mr={4} variant={"link"}>
                  <Link href="/admin">{t("admin")}</Link>
                </Button>
              )}
              <Button mr={4} variant={"link"}>
                <Link href="/logout">{t("log-out")}</Link>
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
