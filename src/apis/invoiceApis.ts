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
        getAllGuardPayments: builder.query({
            query: () => `/invoicing/getAllGuardPayments`,
            providesTags: ["Invoice"],
        }),
        generateGuardPayment: builder.mutation({
            query: (data) => ({
                url: "/invoicing/generateGuardPayment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Invoice"],
        }),
        updateGuardPaymentStatus: builder.mutation({
            query: ({ id, data }) => ({
                url: `/invoicing/updateGuardPaymentStatus/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Invoice"],
        }),
        generateInvoicePDF: builder.mutation({
            query: (id) => ({
                url: `/invoicing/generateInvoicePDF/${id}`,
                method:"POST"
            }),
            invalidatesTags: ["Invoice"]
        }),
    }),
});

export const {
    useGetAllInvoiceQuery,
    useGenerateInvoiceMutation,
    useGetAllGuardPaymentsQuery,
    useGenerateGuardPaymentMutation,
    useUpdateGuardPaymentStatusMutation,
    useGenerateInvoicePDFMutation
} = invoiceApis;
