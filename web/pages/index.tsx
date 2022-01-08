import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setToken } from "../redux/token";

const Home = () => {
  const token = useAppSelector((state) => state.access_token.data);
  const dispatch = useAppDispatch();

  return (
    <div>
      <Navbar />
      <button
        onClick={() => {
          dispatch(setToken("hi"));
        }}
      >
        Set token
      </button>
      <br />
      <span>Token: {token}</span>
    </div>
  );
};

export default Home;
