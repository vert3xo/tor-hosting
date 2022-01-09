import Navbar from "./components/Navbar";
import { Post } from "../../types/Post";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Container, Heading, Text, Link, Flex } from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";

const Blog = () => {
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
        <p>Error</p>
      </>
    );
  }
  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading...</p>
      </>
    );
  }

  if (!data || !data!.posts || data!.posts!.length === 0) {
    return (
      <>
        <Navbar />
        <p>No posts available</p>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      {data!.posts.map((post, index) => {
        return (
          <Container key={index} ml={4}>
            <Heading>
              <Link href={`/blog/posts/${post.id}`}>
                <Flex>
                  <Text mr={4}>{post.title}</Text>
                  <BsArrowRight />
                </Flex>
              </Link>
            </Heading>
            <Text>
              by{" "}
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
