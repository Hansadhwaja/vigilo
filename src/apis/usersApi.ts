// usersApi.ts
import { baseApi } from "./baseApi";

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

// ===== API ENDPOINTS =====
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clients
    getAllClients: builder.query<GetAllClientsResponse, void>({
      query: () => ({
        url: `/users/getAllClients`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Clients' as const, id })),
              { type: 'Clients', id: 'LIST' },
            ]
          : [{ type: 'Clients', id: 'LIST' }],
    }),

    // Get single client by ID
    getClientById: builder.query<GetClientByIdResponse, string>({
      query: (id: string) => ({
        url: `/users/getClientById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Clients", id }],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Clients", id },
        { type: "Clients", id: "LIST" },
      ],
    }),

    // Delete client
    deleteClient: builder.mutation<DeleteClientResponse, { id: string }>({
      query: (body) => ({
        url: `/users/deleteClient`,
        method: "POST",
        body, // contains { id }
      }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),
  }),
});

// Export hooks
export const {
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useEditClientMutation,
  useDeleteClientMutation,
} = usersApi;
