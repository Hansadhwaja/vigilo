import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body: {
          ...body,
          role: "admin"
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
