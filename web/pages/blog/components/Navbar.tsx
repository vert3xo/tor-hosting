import { useAppSelector } from "../../../redux/store";
import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { BsArrowLeft } from "react-icons/bs";
import ColorThemeChanger from "../../../components/ColorThemeChanger";
import { gql, useQuery } from "@apollo/client";
import { User } from "../../../types/User";
import { useTranslation } from "next-i18next";
import LocaleChanger from "../../../components/LocaleChanger";

const Navbar = () => {
  const { t } = useTranslation("navbar-main");
  const token = useAppSelector((state) => state.blog_token.data);

  const { loading, error, data } = useQuery<{ me: User }>(
    gql`
      query GetUserInfo {
        me {
          author {
            id
          }
        }
      }
    `,
    { context: { headers: { Authorization: `Bearer ${token}` } } }
  );

  return (
    <Box mt={4} mb={8} borderBottom={"2px solid gray"} width={"100vw"}>
      <Flex width={"100%"}>
        <Flex>
          <Button ml={4} variant={"link"}>
            <Link href="/">
              <Flex>
                <BsArrowLeft />
                <Text ml={2}>{t("main-site")}</Text>
              </Flex>
            </Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/blog">{t("posts")}</Link>
          </Button>
          <ColorThemeChanger />
          <LocaleChanger />
        </Flex>
        <Spacer />
        <Flex mb={4}>
          {!token ? (
            <>
              <Button mr={4} variant={"link"}>
                <Link href="/blog/login">{t("sign-in")}</Link>
              </Button>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/blog/register">{t("sign-up")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/blog/post">{t("create-post-btn")}</Link>
              </Button>
              {!loading && !error && (
                <Button mr={4} variant={"link"}>
                  <Link href={`/blog/authors/${data!.me!.author!.id!}`}>
                    {t("profile")}
                  </Link>
                </Button>
              )}
              <Button mr={4} variant={"link"}>
                <Link href="/blog/logout">{t("log-out")}</Link>
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
