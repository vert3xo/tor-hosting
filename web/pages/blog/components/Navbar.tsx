import { useAppSelector } from "../../../redux/store";
import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { BsArrowLeft } from "react-icons/bs";
import ColorThemeChanger from "../../../components/ColorThemeChanger";

const Navbar = () => {
  const token = useAppSelector((state) => state.blog_token.data);

  return (
    <Box mt={4} mb={8} borderBottom={"2px solid gray"} width={"100vw"}>
      <Flex width={"100%"}>
        <Flex>
          <Button ml={4} variant={"link"}>
            <Link href="/">
              <Flex>
                <BsArrowLeft />
                <Text ml={2}>Back Home</Text>
              </Flex>
            </Link>
          </Button>
          <Button ml={4} variant={"link"}>
            <Link href="/blog">Posts</Link>
          </Button>
          <ColorThemeChanger />
        </Flex>
        <Spacer />
        <Flex mb={4}>
          {!token ? (
            <>
              <Button mr={4} variant={"link"}>
                <Link href="/blog/login">Sign In</Link>
              </Button>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/blog/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button mr={4} colorScheme={"blue"}>
                <Link href="/blog/post">Create a post</Link>
              </Button>
              <Button mr={4} variant={"link"}>
                <Link href={`/blog/authors/1`}>Profile</Link>
              </Button>
              <Button mr={4} variant={"link"}>
                <Link href="/blog/logout">Log out</Link>
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
