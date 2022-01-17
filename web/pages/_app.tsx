import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { appWithTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    credentials: "include",
    link: setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
        },
      };
    }).concat(
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_BLOG_URI,
      })
    ),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ApolloProvider>
    </Provider>
  );
}
export default appWithTranslation(MyApp);
