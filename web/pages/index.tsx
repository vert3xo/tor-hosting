import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageHead from "../components/PageHead";
import Image from "next/image";
import { Button, Center, Divider, Heading, Text, Box } from "@chakra-ui/react";
import { BsArrowDown } from "react-icons/bs";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import ImageCta from "../components/ImageCta";

const Home = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div>
      <PageHead title="Home" />
      <Navbar />
      <Box minH={"100vh"}>
        <Center flexDir={"column"}>
          <Image src="/img/tor.png" width={200} height={200} alt="Tor Logo" />
          <Heading mt={8} mb={8}>
            {t("home-heading")}
          </Heading>
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
          <Divider width={"90%"} my={8} />
        </Center>

        <ImageCta
          src="/img/onion_url.png"
          width={566}
          height={126}
          alt="Address Regeneration"
        >
          <Text>{t("cta-text1")}</Text>
        </ImageCta>
        <ImageCta
          src="/img/upload_content.png"
          imageSide="right"
          width={539}
          height={123}
          alt="Content Upload"
        >
          <Text>{t("cta-text2")}</Text>
        </ImageCta>
      </Box>
      <Footer />
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
        "footer",
      ])),
    },
  };
};
