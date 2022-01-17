import React, { FC, useState } from "react";
import { Axios } from "../utils/axiosUtil";
import {
  HStack,
  Button,
  Input,
  Text,
  Container,
  useToast,
} from "@chakra-ui/react";
import { successToast, errorToast } from "../types/toast";
import { Token } from "../types/tokenComponent";
import { useTranslation } from "next-i18next";

const UploadContent: FC<Token> = ({ token }) => {
  const { t } = useTranslation("upload-content");
  const toast = useToast();
  const [siteArchive, setSiteArchive] = useState<File | null>(null);

  return (
    <Container centerContent>
      <Text mb={"5"}>
        <b>{t("upload-heading")}</b>
      </Text>
      <form action="#">
        <HStack>
          <Input
            type="file"
            border={"none"}
            onChange={(e) => {
              if (!!e.currentTarget.files && e.currentTarget.files!.length > 0)
                setSiteArchive(e.currentTarget.files[0]);
            }}
          />
          <Button
            type="submit"
            size={"sm"}
            colorScheme={"green"}
            onClick={(e) => {
              e.preventDefault();
              if (!!siteArchive) {
                const data = new FormData();
                data.append("files", siteArchive);
                Axios.post("/user/upload", data, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(() => {
                    toast({
                      ...successToast,
                      description:
                        "Website content uploaded, try visiting your site.",
                    });
                  })
                  .catch((e) => {
                    toast({
                      ...errorToast,
                      description: "Could not upload your website.",
                    });
                  });
              }
            }}
          >
            {t("upload-btn")}
          </Button>
        </HStack>
      </form>
    </Container>
  );
};

export default UploadContent;
