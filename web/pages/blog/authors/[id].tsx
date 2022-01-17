import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  Container,
  Divider,
  Heading,
  Link,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useAppSelector } from "../../../redux/store";
import type { Author as AuthorType } from "../../../types/Author";
import { User } from "../../../types/User";
import isServer from "../../../utils/isServer";
import Navbar from "../components/Navbar";
import { useTranslation } from "next-i18next";

const Author = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const token = useAppSelector((state) => state.blog_token.data);
  const [getAuthor, getAuthorData] = useLazyQuery<{
    author: AuthorType | null;
  }>(gql`
    query GetAuthor($id: Int!) {
      author(id: $id) {
        id
        name
        posts {
          id
          title
        }
      }
    }
  `);

  const [mutateDeletePost, deletePostData] = useMutation<{
    deletePost: boolean;
  }>(
    gql`
      mutation DeletePost($id: Int!) {
        deletePost(id: $id)
      }
    `,
    { context: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const userData = useQuery<{ me: User }>(
    gql`
      query GetUser {
        me {
          id
        }
      }
    `,
    { context: { headers: { Authorization: `Bearer ${token}` } } }
  );

  useEffect(() => {
    if (router.isReady) {
      getAuthor({ variables: { id: parseInt(router.query.id as string) } });
    }
  }, [router.isReady, router.query.id, getAuthor]);

  if (getAuthorData.loading) {
    return (
      <>
        <Navbar />
        <Text>{t("loading")}</Text>
      </>
    );
  }

  if (!!getAuthorData.error) {
    return (
      <>
        <Navbar />
        <Text>{t("error")}</Text>
      </>
    );
  }

  if (!getAuthorData.data || !getAuthorData.data.author) {
    return (
      <>
        <Navbar />
        <Text>{t("no-author-err")}</Text>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <Container>
        <Container>
          <Heading>{getAuthorData.data.author.name}</Heading>
          <Text>
            {getAuthorData.data.author!.posts!.length} {t("posts")}
          </Text>
        </Container>
        <Divider mt={4} mb={4} w={"95%"} />
        <Container>
          {getAuthorData.data
            .author!.posts!.slice()
            .reverse()
            .map((post, index) => {
              return (
                <Container key={index} mb={4}>
                  <Heading size={"md"}>
                    <Flex justifyContent={"space-between"}>
                      <Link href={`/blog/posts/${post.id}`}>
                        <Flex>
                          <Text mr={4}>{post.title}</Text>
                          <BsArrowRight />
                        </Flex>
                      </Link>
                      {token &&
                        userData.data &&
                        userData.data.me!.id! ==
                          getAuthorData.data!.author!.id && (
                          <Button
                            colorScheme={"red"}
                            size={"sm"}
                            isLoading={deletePostData.loading}
                            onClick={() => {
                              mutateDeletePost({ variables: { id: post.id! } });
                              if (!isServer) {
                                router.reload();
                              }
                            }}
                          >
                            {t("delete-post-btn")}
                          </Button>
                        )}
                    </Flex>
                  </Heading>
                </Container>
              );
            })}
        </Container>
      </Container>
    </div>
  );
};

export default Author;

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
