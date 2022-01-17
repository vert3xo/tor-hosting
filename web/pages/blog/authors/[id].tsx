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

const Author = () => {
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
        <Text>Loading...</Text>
      </>
    );
  }

  if (!!getAuthorData.error) {
    return (
      <>
        <Navbar />
        <Text>{JSON.stringify(getAuthorData.error)}</Text>
      </>
    );
  }

  if (!getAuthorData.data || !getAuthorData.data.author) {
    return (
      <>
        <Navbar />
        <Text>This author does not exist</Text>
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
            {getAuthorData.data.author!.posts!.length} post
            {getAuthorData.data.author!.posts!.length > 1 ? "s" : ""}
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
                            Delete Post
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
