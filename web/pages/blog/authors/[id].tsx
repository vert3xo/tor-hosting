import { gql, useLazyQuery } from "@apollo/client";
import {
  Container,
  Divider,
  Heading,
  Link,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import type { Author as AuthorType } from "../../../types/Author";
import Navbar from "../components/Navbar";

const Author = () => {
  const router = useRouter();
  const [getAuthor, { loading, error, data }] = useLazyQuery<{
    author: AuthorType | null;
  }>(gql`
    query GetAuthor($id: Int!) {
      author(id: $id) {
        name
        posts {
          id
          title
        }
      }
    }
  `);

  useEffect(() => {
    if (router.isReady) {
      getAuthor({ variables: { id: parseInt(router.query.id as string) } });
    }
  }, [router.isReady]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Text>Loading...</Text>
      </>
    );
  }

  if (!!error) {
    return (
      <>
        <Navbar />
        <Text>{JSON.stringify(error)}</Text>
      </>
    );
  }

  if (!data || !data.author) {
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
          <Heading>{data.author.name}</Heading>
          <Text>
            {data.author!.posts!.length} post
            {data.author!.posts!.length > 1 ? "s" : ""}
          </Text>
        </Container>
        <Divider mt={4} mb={4} w={"95%"} />
        <Container>
          {data.author!.posts!.map((post, index) => {
            return (
              <Container key={index} mb={4}>
                <Heading size={"md"}>
                  <Link href={`/blog/posts/${post.id}`}>
                    <Flex>
                      <Text mr={4}>{post.title}</Text>
                      <BsArrowRight />
                    </Flex>
                  </Link>
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
