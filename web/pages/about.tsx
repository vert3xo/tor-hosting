import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageHead from "../components/PageHead";
import Navbar from "../components/Navbar";
import { Center, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

const About = () => {
  const { t } = useTranslation("common");
  return (
    <div>
      <PageHead title="About" />
      <Navbar />
      <Center flexDir={"column"}>
        <Heading mb={4}>{t("about-heading")}</Heading>
        <Text>{t("about-p1")}</Text>
      </Center>
    </div>
  );
};

export default About;

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
