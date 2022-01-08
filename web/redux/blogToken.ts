import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  data: string | null;
}

const initialState: TokenState = {
  data: null,
};

const blogToken = createSlice({
  name: "blogToken",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.data = action.payload;
    },
  },
});

export const { setToken } = blogToken.actions;

export default blogToken.reducer;
