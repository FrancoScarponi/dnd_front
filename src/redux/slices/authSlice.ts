import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/userTypes";


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    authError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    initSession(state, action: PayloadAction<{ user: User | null; token: string | null }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { authStart, authSuccess, authError, initSession, logout } =
  authSlice.actions;

export default authSlice.reducer;
