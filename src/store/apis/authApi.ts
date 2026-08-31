import { baseApi } from "./baseApi";
import type { AuthUser } from "../slices/authSlice";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthSuccessResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

interface AuthErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body: {
          ...body,
          role: "admin",
        },
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/users/admin-register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
