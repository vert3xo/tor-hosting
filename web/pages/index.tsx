import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageHead from "../components/PageHead";
import Image from "next/image";
import { Button, Center, Heading, Text } from "@chakra-ui/react";
import { BsArrowDown } from "react-icons/bs";
import { useRouter } from "next/router";

const Home = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div>
      <PageHead title="Home" />
      <Navbar />
      <Center flexDir={"column"}>
        <Image src="/img/tor.png" width={200} height={200} />
        <Heading mt={8}>{t("home-heading")}</Heading>
        <Text>{t("home-p1")}</Text>
        <Text mb={4}>{t("home-p2")}</Text>
        <BsArrowDown size={40} />
        <Button
          size={"lg"}
          mt={8}
          colorScheme={"blue"}
          onClick={() => router.push("/register")}
        >
          {t("btn-start")}
        </Button>
      </Center>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "navbar-main",
      ])),
    },
  };
};
