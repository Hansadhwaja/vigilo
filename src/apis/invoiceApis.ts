import { baseApi } from "./baseApi";



export const invoiceApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllInvoice: builder.query({
            query: () => "/invoicing/getAllInvoice",
            providesTags: ["Invoice"],
        }),

        generateInvoice: builder.mutation({
            query: (data) => ({
                url: "/invoicing/generateInvoice",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Invoice"],
        }),
    }),
});

export const {
    useGetAllInvoiceQuery,
    useGenerateInvoiceMutation
} = invoiceApis;
