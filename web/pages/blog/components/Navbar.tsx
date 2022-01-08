import { useAppSelector } from "../../../redux/store";
import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { BsArrowLeft } from "react-icons/bs";
import ColorThemeChanger from "../../../components/ColorThemeChanger";

const Navbar = () => {
  const token = useAppSelector((state) => state.blog_token);

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
          <Button mr={4} variant={"link"}>
            <Link href="/blog/signin">Sign In</Link>
          </Button>
          <Button mr={4} colorScheme={"blue"}>
            <Link href="/blog/signup">Sign Up</Link>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
