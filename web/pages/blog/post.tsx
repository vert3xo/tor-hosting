import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import Protected from "./components/Protected";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import isServer from "../../utils/isServer";
import { useAppSelector } from "../../redux/store";

const Post = () => {
  const router = useRouter();
  const token = useAppSelector((state) => state.blog_token.data);
  const CreatePostSchema = Yup.object().shape({
    title: Yup.string().required("Title is required!"),
    body: Yup.string().required("Post body is required!"),
  });

  const [mutateCreatePost, { loading, error, data }] = useMutation<{
    createPost: boolean;
  }>(
    gql`
      mutation CreatePost($title: String!, $body: String!) {
        createPost(title: $title, body: $body)
      }
    `,
    { context: { headers: { Authorization: `Bearer ${token}` } } }
  );

  if (!!data && data.createPost) {
    if (!isServer) {
      router.push("/blog");
    }
  }

  return (
    <Protected>
      <Center flexDirection={"column"}>
        <Heading mb={8}>Create a post</Heading>
        <Formik
          initialValues={{ title: "", body: "" }}
          validationSchema={CreatePostSchema}
          onSubmit={(values) => {
            mutateCreatePost({
              variables: { title: values.title, body: values.body },
            }).catch((e) => {});
          }}
        >
          {(props) => (
            <Form style={{ width: "30%" }}>
              <FormControl mb={4} id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={props.values.title}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                />
                {!!props.errors.title && !!props.touched.title && (
                  <FormHelperText color="red">
                    {props.errors.title}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl mb={4} id="body">
                <FormLabel>Post body</FormLabel>
                <Textarea
                  type="text"
                  name="body"
                  value={props.values.body}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  height={400}
                />
                {!!props.errors.body && !!props.touched.body && (
                  <FormHelperText color="red">
                    {props.errors.body}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                isLoading={loading}
                colorScheme={"blue"}
                width={"100%"}
              >
                Post
              </Button>
              <FormControl>
                <FormHelperText color={"red"} fontSize={18}>
                  {(!!data && !data.createPost) || !!error
                    ? "An error occurred!"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Center>
    </Protected>
  );
};

export default Post;
