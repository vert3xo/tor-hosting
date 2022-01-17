import { IconButton, useColorMode } from "@chakra-ui/react";
import { BsSun, BsMoonFill } from "react-icons/bs";

const ColorThemeChanger = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={`Toggle ${colorMode === "dark" ? "light" : "dark"} mode`}
      icon={colorMode === "dark" ? <BsSun /> : <BsMoonFill />}
      mr={2}
      ml={2}
      mb={2}
      size={"lg"}
      variant={"link"}
      onClick={toggleColorMode}
    />
  );
};

export default ColorThemeChanger;
