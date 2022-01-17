import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Center,
  Switch,
  Flex,
  useToast,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import AdminProtected from "../../components/AdminProtected";
import { useAppSelector } from "../../redux/store";
import { Response, User } from "../../types/userTypes";
import isServer from "../../utils/isServer";
import { useTranslation } from "next-i18next";
import PageHead from "../../components/PageHead";

const Admin = () => {
  const { t } = useTranslation("common");
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.access_token.data);
  const AxiosAdmin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/admin",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const [users, setUsers] = useState<User[] | null>(null);
  const [passwords, setPasswords] = useState<string[]>();

  const fetchUsers = () => {
    if (!users) {
      AxiosAdmin.get<Response<User[]>>("/user")
        .then((res) => {
          const data: User[] | null = res.data.data;
          setUsers(data);
          setPasswords([]);
          if (!!data) {
            data.forEach((user, index) => (passwords![index] = ""));
          }
        })
        .catch(() => {});
    }
  };

  return (
    <AdminProtected>
      <PageHead title="Admin" />
      {fetchUsers()}
      {!!users && !!passwords && (
        <Center>
          <div>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>{t("username")}</Th>
                  <Th>{t("enabled")}</Th>
                  <Th>{t("change-password")}</Th>
                  <Th>{t("delete")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        <b>{user.Username}</b>
                      </Td>
                      <Td>
                        <Switch
                          defaultChecked={!user.Disabled}
                          onChange={(e) => {
                            const uri = user.Disabled ? "enable" : "disable";
                            AxiosAdmin.post(`/user/${uri}/${user.Username}`)
                              .then(() => {
                                user.Disabled = !e.target.checked;
                              })
                              .catch((e) => {});
                          }}
                        />
                      </Td>
                      <Td>
                        <FormControl>
                          <Flex>
                            <Input
                              type="password"
                              placeholder={t("new-pwd-placeholder")}
                              value={passwords[index]}
                              onChange={(e) => {
                                passwords[index] = e.currentTarget.value;
                              }}
                            />
                            <Button
                              type="submit"
                              loading={loading}
                              onClick={(e) => {
                                e.preventDefault();
                                setLoading(true);

                                AxiosAdmin.post(`/user/${user.Username}`, {
                                  password: passwords[index],
                                })
                                  .then((res) => {
                                    passwords[index] = "";
                                  })
                                  .catch((e) => {
                                    setLoading(false);
                                  });
                              }}
                            >
                              {t("new-pwd-btn")}
                            </Button>
                          </Flex>
                        </FormControl>
                      </Td>
                      <Td>
                        <Button
                          colorScheme={"red"}
                          onClick={() => {
                            AxiosAdmin.delete(`/user/${user.Username}`)
                              .then((res) => {
                                if (!isServer) {
                                  router.reload();
                                }
                              })
                              .catch((e) => {});
                          }}
                        >
                          {t("delete-account")}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        </Center>
      )}
    </AdminProtected>
  );
};

export default Admin;

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
