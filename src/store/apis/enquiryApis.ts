import { baseApi } from "./baseApi";

export const enquiryApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: "/enquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enquiry"],
    }),
    getAllTicket: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams();

        if (params.page) qs.set("page", params.page);
        if (params.limit) qs.set("limit", params.limit);
        if (params.search) qs.set("search", params.search);
        if (params.userId) qs.set("userId", params.userId);

        return qs.toString() ? `/enquiries?${qs.toString()}` : "/enquiries";
      },
      providesTags: ["Enquiry"],
    }),
  }),
});

export const { useCreateTicketMutation, useGetAllTicketQuery } = enquiryApis;
