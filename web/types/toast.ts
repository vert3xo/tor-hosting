import { UseToastOptions } from "@chakra-ui/react";

export const errorToast: UseToastOptions = {
  title: "An error occurred!",
  description: "The action encountered an error.",
  status: "error",
  duration: 9000,
  isClosable: true,
};

export const successToast: UseToastOptions = {
  title: "Success!",
  description: "The action was successful.",
  status: "success",
  duration: 9000,
  isClosable: true,
};
