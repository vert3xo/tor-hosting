import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC } from "react";

const LinkExternal: FC<{ href: string }> = ({ children, href }) => {
  return (
    <Link href={href} target="_blank" referrerPolicy="no-referrer">
      {children}
    </Link>
  );
};

const List: FC = ({ children }) => {
  return <Stack align={"flex-start"}>{children}</Stack>;
};

const ListHeader: FC = ({ children }) => {
  return (
    <Text fontWeight={"bold"} fontSize={"lg"}>
      {children}
    </Text>
  );
};

const LocaleLink: FC<{ href: string }> = ({ children, href }) => {
  const router = useRouter();
  return (
    <Link
      onClick={() => {
        router.push(href, href, { locale: router.locale });
      }}
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <Box
      mt={20}
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid spacing={8} templateColumns={"2fr repeat(4, 1fr)"}>
          <Stack spacing={6}>
            <Box>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                Tor Hosting
              </Text>
            </Box>
            <Text fontSize={"sm"}>
              &copy; {new Date().getFullYear()} Filip Timko
            </Text>
          </Stack>
          <List>
            <ListHeader>{t("list-website")}</ListHeader>
            <LocaleLink href="/about">{t("website-about")}</LocaleLink>
            <LocaleLink href="/blog">Blog</LocaleLink>
          </List>
          <List>
            <ListHeader>{t("list-socials")}</ListHeader>
            <LinkExternal href="https://github.com/vert3xo">
              GitHub
            </LinkExternal>
            <LinkExternal href="https://twitter.com/vert3xo">
              Twitter
            </LinkExternal>
          </List>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Footer;
