import { useRouter } from "next/router";
import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import isServer from "../../../utils/isServer";
import Navbar from "./Navbar";

const Protected: FC = ({ children }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state.blog_token.data);

  if (!token) {
    if (!isServer) {
      router.push("/blog/login");
    }
    return null;
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Protected;
