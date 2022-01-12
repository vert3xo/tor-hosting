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
import router, { useRouter } from "next/router";
import { useState } from "react";
import AdminProtected from "../../components/AdminProtected";
import { useAppSelector } from "../../redux/store";
import { Response, User } from "../../types/user";
import isServer from "../../utils/isServer";

const Admin = () => {
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
      {fetchUsers()}
      {!!users && !!passwords && (
        <Center>
          <div>
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>Enabled</Th>
                  <Th>Change Password</Th>
                  <Th>Delete</Th>
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
                              placeholder="Password"
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
                              Change
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
                          Delete account
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
