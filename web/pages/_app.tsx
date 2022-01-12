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

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_BLOG_URI,
    cache: new InMemoryCache(),
    credentials: "include",
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
