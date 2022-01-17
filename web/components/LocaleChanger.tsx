import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const LocaleChanger = () => {
  const router = useRouter();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {router.locale}
      </MenuButton>
      <MenuList>
        {router
          .locales!.filter((locale) => locale !== router.locale)
          .map((locale, index) => (
            <MenuItem
              key={index}
              onClick={() =>
                router.push(router.pathname, router.pathname, { locale })
              }
            >
              {locale}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};

export default LocaleChanger;
