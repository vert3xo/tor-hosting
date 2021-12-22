import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { save, load, LoadOptions, RLSOptions } from "redux-localstorage-simple";
import isServer from "../utils/isServer";
import tokenReducer from "./token";

let store = configureStore({
  reducer: {
    access_token: tokenReducer,
  },
});

const options: LoadOptions | RLSOptions = {
  states: ["access_token"],
  namespace: "torhost",
};

if (!isServer) {
  // @ts-ignore
  store = configureStore({
    reducer: {
      access_token: tokenReducer,
    },
    preloadedState: load(options),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(save(options)),
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
