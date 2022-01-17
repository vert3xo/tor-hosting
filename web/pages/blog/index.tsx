import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Navbar from "./components/Navbar";
import { Post } from "../../types/Post";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Container, Heading, Text, Link, Flex } from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { useTranslation } from "next-i18next";
import PageHead from "../../components/PageHead";

const Blog = () => {
  const { t } = useTranslation("common");
  const { loading, error, data } = useQuery<{ posts: Post[] | null }>(gql`
    query GetPosts {
      posts {
        id
        title
        authors {
          id
          name
        }
      }
    }
  `);

  if (!!error) {
    console.log(error);
    return (
      <>
        <Navbar />
        <p>{t("error")}</p>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <p>{t("loading")}</p>
      </>
    );
  }

  if (!data || !data!.posts || data!.posts!.length === 0) {
    return (
      <>
        <Navbar />
        <p>{t("no-posts-err")}</p>
      </>
    );
  }

  return (
    <div>
      <PageHead title="Home" />
      <Navbar />
      {data!.posts
        .slice()
        .reverse()
        .map((post, index) => {
          return (
            <Container key={index} ml={4} pb={4}>
              <Heading>
                <Link href={`/blog/posts/${post.id}`}>
                  <Flex>
                    <Text mr={4}>{post.title}</Text>
                    <BsArrowRight />
                  </Flex>
                </Link>
              </Heading>
              <Text>
                {t("by")}{" "}
                {post.authors!.map((author, index) => {
                  return (
                    <Link key={index} href={`/blog/authors/${author.id}`}>
                      {author.name}
                    </Link>
                  );
                })}
              </Text>
            </Container>
          );
        })}
    </div>
  );
};

export default Blog;

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
