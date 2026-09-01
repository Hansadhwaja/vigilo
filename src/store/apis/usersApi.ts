// usersApi.ts
import { baseApi } from "./baseApi";
import { Pagination } from "./ordersApi";

// ===== INTERFACES =====
export interface Client {
  id: string;
  name: string;
  email: string;
  mobile: string;
  countryCode?: string;
  address: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllClientsResponse {
  success: boolean;
  message: string;
  data: Client[];
}

export interface GetClientByIdResponse {
  success: boolean;
  message: string;
  data: Client;
}

export interface EditClientPayload {
  name?: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  address?: string;
  avatar?: string;
}

export interface EditClientResponse {
  success: boolean;
  message: string;
  data: Client;
}

export interface DeleteClientResponse {
  success: boolean;
  message: string;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}
export interface GetAllClientResponse {
  success: boolean;
  message: string;
  data: Client[];
  pagination?: Pagination;
  summary: {
    total: number;
    active: number;
  };
}

export interface GetAllClientParams {
  search?: string;
  page?: number;
  limit?: number;
}

// ===== API ENDPOINTS =====
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clients
    getAllClients: builder.query<
      GetAllClientResponse,
      GetAllClientParams | void
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.search) queryParams.append("search", params.search);
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
        }

        return {
          url: `/users/getAllClients${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Clients"],
    }),
    createUserByAdmin: builder.mutation({
      query: (body) => ({
        url: "/users/createUserByAdmin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),

    // Get single client by ID
    getClientById: builder.query<GetClientByIdResponse, string>({
      query: (id: string) => ({
        url: `/users/getClientById/${id}`,
        method: "GET",
      }),
      providesTags:["Clients"]
    }),

    // Edit client
    editClient: builder.mutation<
      EditClientResponse,
      { id: string; body: EditClientPayload }
    >({
      query: ({ id, body }) => ({
        url: `/users/editClient/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clients"]
    }),

    // Delete client
    deleteClient: builder.mutation<DeleteClientResponse, { id: string }>({
      query: (body) => ({
        url: `/users/deleteClient`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"]
    }),

    // Upload single image
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: `/upload/single-image`,
        method: "POST",
        body: formData,
      }),
    }),

    exportUsers: builder.mutation({
      query: () => ({
        url: "/users/export",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Clients"],
    }),
    exportGuards: builder.mutation({
      query: () => ({
        url: "/users/export-guards",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useEditClientMutation,
  useDeleteClientMutation,
  useUploadImageMutation,
  useExportUsersMutation,
  useExportGuardsMutation,
  useCreateUserByAdminMutation,
} = usersApi;
