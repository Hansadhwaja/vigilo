// ordersApi.ts
import { baseApi } from "./baseApi";

// Interfaces for Order data structures
export interface SiteServiceCoordinates {
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  type: string;
  coordinates: [number, number];
}

export interface Order {
  id: string;
  serviceType: string;
  locationName: string;
  locationAddress: string;
  siteService: SiteServiceCoordinates;
  guardsRequired: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface GetAllOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
}

export interface GetOrderByIdResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AcceptOrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Query parameters for getAllOrders
export interface GetAllOrdersParams {
  limit?: number;
  page?: number;
  status?: string;
  serviceType?: string;
  search?: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders with pagination and filters
    getAllOrders: builder.query<GetAllOrdersResponse, GetAllOrdersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params) {
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.status) queryParams.append('status', params.status);
          if (params.serviceType) queryParams.append('serviceType', params.serviceType);
          if (params.search) queryParams.append('search', params.search);
        }
        
        return {
          url: `/orders/getAllOrders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    // Get order by ID
    getAdminOrderById: builder.query<GetOrderByIdResponse, string>({
      query: (id: string) => ({
        url: `/orders/getAdminOrderById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    // Cancel order
    cancelOrder: builder.mutation<CancelOrderResponse, string>({
      query: (id: string) => ({
        url: `/orders/cancelOrder/${id}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // Accept order
    acceptOrder: builder.mutation<AcceptOrderResponse, string>({
      query: (id: string) => ({
        url: `/orders/acceptOrder/${id}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // Get all clients
getAllClients: builder.query<
  {
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
      mobile: string;
      address: string;
    };
  },
  void
>({
  query: () => ({
    url: `/users/getAllClients`,
    method: "GET",
  }),
  providesTags: [{ type: "Clients", id: "LIST" }],
}),

 
// Delete client
deleteClient: builder.mutation<
  { success: boolean; message: string },
  { id: string }
>({
  query: (body) => ({
    url: `/users/deleteClient`,
    method: "POST",
    body, // contains { id }
  }),
  invalidatesTags: [
    { type: "Clients", id: "LIST" }
  ],
}),

// ---- GET ONE ORDER BY ID (ADMIN VIEW) ----
getOrderById: builder.query<
  { success: boolean; message: string; data: any },
  string
>({
  query: (id: string) => ({
    url: `/orders/getAdminOrderById/${id}`,
    method: "GET",
  }),

  transformResponse: (res: any) => {
    const o = res.data;

    const mapped = {
      id: o.id,
      serviceType: o.serviceType,
      locationName: o.locationName || "Unknown",
      locationAddress: o.locationAddress || "Not Provided",

      siteService: o.siteService || {
        crs: { type: "", properties: { name: "" } },
        type: "Point",
        coordinates: [0, 0],
      },

      guardsRequired: o.guardsRequired || 0,
      description: o.description || "",
      startDate: o.startDate,
      endDate: o.endDate,
      startTime: o.startTime,
      endTime: o.endTime,
      status: o.status || "pending",

      images: o.images || [],
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      deletedAt: o.deletedAt || null,

      userId: o.userId,

      // 👇 Mapping the User Object (Important!)
      client: o.user
        ? {
            id: o.user.id,
            name: o.user.name,
            email: o.user.email,
            mobile: o.user.mobile,
            address: o.user.address,
          }
        : null,
    };

    return { ...res, data: mapped };
  },

  providesTags: (_result, _error, id) => [{ type: "Orders", id }],
}),



  }),
});

export const {
  useGetAllOrdersQuery,
  useGetAdminOrderByIdQuery,
  useCancelOrderMutation,
  useAcceptOrderMutation,
   useGetAllClientsQuery,
   useDeleteClientMutation,
   useGetOrderByIdQuery,

} = ordersApi;