import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import type { Post as PostType } from "../../../types/Post";
import React, { useEffect } from "react";
import {
  Divider,
  Heading,
  Text,
  Center,
  Container,
  Link,
} from "@chakra-ui/react";
import Markdown from "../../../components/Markdown";
import Navbar from "../components/Navbar";
import { useTranslation } from "next-i18next";

const Post = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [getPost, { loading, error, data }] = useLazyQuery<{
    post: PostType | null;
  }>(
    gql`
      query GetPost($id: Int!) {
        post(id: $id) {
          title
          body
          authors {
            id
            name
          }
        }
      }
    `,
    {}
  );

  useEffect(() => {
    if (router.isReady) {
      getPost({ variables: { id: parseInt(router.query.id as string) } });
    }
  }, [router.isReady, router.query.id, getPost]);

  if (loading || loading === undefined) {
    return (
      <>
        <Navbar />
        <Text>{t("loading")}</Text>
      </>
    );
  }
  if (!!error) {
    return (
      <>
        <Navbar />
        <Text>{t("error")}</Text>
      </>
    );
  }
  if (!data || !data.post) {
    return (
      <>
        <Navbar />
        <Text>{t("no-post-err")}</Text>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <Container>
        <Heading mb={4}>{data!.post.title}</Heading>
        <Markdown>{data!.post.body!}</Markdown>
        <Center>
          <Divider mt={4} mb={4} w={"95%"} />
        </Center>
        {data!.post.authors!.map((author) => {
          return (
            <Link href={`/blog/authors/${author.id}`} key={data!.post!.id!}>
              {author.name}
            </Link>
          );
        })}
      </Container>
    </div>
  );
};

export default Post;

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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
