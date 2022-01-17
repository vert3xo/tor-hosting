import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setToken } from "../redux/token";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Home = () => {
  const token = useAppSelector((state) => state.access_token.data);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  return (
    <div>
      <Navbar />
      <button
        onClick={() => {
          dispatch(setToken("hi"));
        }}
      >
        {t("token")}
      </button>
      <br />
      <span>Token: {token}</span>
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
