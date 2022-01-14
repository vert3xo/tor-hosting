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

function MyApp({ Component, pageProps }: AppProps) {
  const link = new HttpLink({
    uri: process.env.NEXT_PUBLIC_BLOG_URI,
  });

  const apolloClient = new ApolloClient({
    // uri: process.env.NEXT_PUBLIC_BLOG_URI,
    cache: new InMemoryCache(),
    credentials: "include",
    link: setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
        },
      };
    }).concat(link),
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
export default MyApp;
