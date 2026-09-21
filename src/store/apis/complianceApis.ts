import { baseApi } from "./baseApi";

export const complianceApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompliance: builder.query({
      query: (params = {}) => {
        const { page, limit, search } = params;
        const qs = new URLSearchParams();
        if (page) qs.set("page", page);
        if (limit) qs.set("limit", limit);
        if (search) qs.set("search", search);

        return qs.toString()
          ? `/users/getAllGuardProfiles?${qs.toString()}`
          : "/users/getAllGuardProfiles";
      },
      providesTags: ["Compliance"],
    }),
    getComplianceById: builder.query({
      query: (id) => `/users/getGuardProfileById/${id}`,
      providesTags: ["Compliance"],
    }),
  }),
});

export const { useGetAllComplianceQuery, useGetComplianceByIdQuery } =
  complianceApis;
