import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC, useRef } from "react";

const ConfirmationDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const cancelRef = useRef<any>();
  const { t } = useTranslation("confirmation-dialog");

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
              {t("alert-header")}
            </AlertDialogHeader>
            <AlertDialogBody>{t("alert-body")}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("btn-cancel")}
              </Button>
              <Button
                colorScheme={"red"}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                ml={3}
              >
                {t("btn-continue")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmationDialog;
