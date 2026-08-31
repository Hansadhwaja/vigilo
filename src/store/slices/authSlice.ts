import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface SetCredentialsPayload {
  token: string;
  user: AuthUser;
}

const token = localStorage.getItem("vigilo-admin-token");
const storedUser = localStorage.getItem("vigilo-admin-user");

const initialState: AuthState = {
  token,
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;

      localStorage.setItem("vigilo-admin-token", token);
      localStorage.setItem("vigilo-admin-user", JSON.stringify(user));
    },

    clearCredentials: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("vigilo-admin-token");
      localStorage.removeItem("vigilo-admin-user");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
