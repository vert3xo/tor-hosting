import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { setToken } from "../redux/blogToken";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { User } from "../types/user";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import Navbar from "./Navbar";

const AdminProtected: FC = ({ children }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state.access_token.data);
  const dispatch = useAppDispatch();
  // assume true at first, change later
  const [isAdmin, setIsAdmin] = useState(true);

  if (!token) {
    Axios.post("/refresh_token", {}, { withCredentials: true })
      .then((res) => {
        dispatch(setToken(res.data.data));

        if (!isServer) {
          router.reload();
        }
      })
      .catch((e) => {
        if (!isServer) {
          router.push("/login");
        }
      });

    return null;
  }

  if (!!token) {
    Axios.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data: User = res.data.data;
        setIsAdmin(data.Admin);
      })
      .catch((e) => {
        setIsAdmin(false);
      });
  }

  useEffect(() => {
    if (!isAdmin) {
      if (!isServer) {
        router.push("/dashboard");
      }
    }
  }, [isAdmin]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AdminProtected;
