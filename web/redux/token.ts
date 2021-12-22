import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  data: string | null;
}

const initialState: TokenState = {
  data: null,
};

const token = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.data = action.payload;
    },
  },
});

export const { setToken } = token.actions;

export default token.reducer;
