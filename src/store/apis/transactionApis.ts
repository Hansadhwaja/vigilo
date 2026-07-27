import { baseApi } from "./baseApi";

export const transactionApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: (params = {}) => {
        const { page, limit } = params;
        const qs = new URLSearchParams();
        if (page) qs.set("page", page);
        if (limit) qs.set("limit", limit);
        return qs.toString()
          ? `/transactions/my?${qs.toString()}`
          : "/transactions/my";
      },
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useGetAllTransactionsQuery } = transactionApis;
