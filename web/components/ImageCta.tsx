import { Center, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";

const ImageCta: FC<{
  src: string;
  imageSide?: "left" | "right";
  width: number;
  height: number;
}> = ({ children, src, imageSide, width, height }) => {
  return (
    <Center mb={8}>
      {imageSide === "right" && (
        <Text fontWeight={"bold"} mr={8}>
          {children}
        </Text>
      )}
      <Box boxShadow={"dark-lg"}>
        <Image src={src} width={width} height={height} />
      </Box>
      {(imageSide === "left" || !imageSide) && (
        <Text fontWeight={"bold"} ml={8}>
          {children}
        </Text>
      )}
    </Center>
  );
};

export default ImageCta;
