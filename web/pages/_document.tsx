import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import Footer from "../components/Footer";
import theme from "../theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body style={{ overflowX: "hidden" }}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
