import { useRouter } from "next/dist/client/router";
import { FC } from "react";
import { Axios } from "../utils/axiosUtil";
import isServer from "../utils/isServer";
import Navbar from "./Navbar";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { setToken } from "../redux/token";

const Protected: FC<{ navbar?: boolean }> = ({ children, navbar }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state.access_token.data);
  const dispatch = useAppDispatch();

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

  return (
    <>
      {navbar !== false && <Navbar />}
      {children}
    </>
  );
};

export default Protected;
