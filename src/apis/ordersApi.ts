// ordersApi.ts
import { RejectOrderFormValues } from "@/schemas";
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
  user?: {
    address: string;
    email: string;
    id: string;
    mobile: string;
    name: string;
  }
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type OrderSummary = {
  active: number;
  avgvalue: number;
  total: number;
  totalRevenue: number;
}

export interface GetAllOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination: Pagination;
  summary: OrderSummary;
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
  userId?: string;
  nonInvoiced?: boolean;
}

// Add this interface at the top with other interfaces
export interface EditOrderPayload {
  serviceType?: string;
  locationName?: string;
  locationAddress?: string;
  siteService?: {
    lat: number;
    lng: number;
  };
  guardsRequired?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  images?: string[];
}

export interface EditOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export type Client = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  avatar?: string;
}
export interface GetAllClientResponse {
  success: boolean;
  message: string;
  data: Client[];
  pagination?: Pagination;
  summary: {
    total: number;
    active: number;
  }
}

export interface GetAllClientParams {
  search?: string;
  page?: number;
  limit?: number
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
          if (params.userId) queryParams.append('userId', params.userId);
          if (params.nonInvoiced) queryParams.append('nonInvoiced', String(params.nonInvoiced));
        }

        return {
          url: `/orders/getAllOrders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    // Get order by ID
    getAdminOrderById: builder.query<GetOrderByIdResponse, string>({
      query: (id: string) => ({
        url: `/orders/getAdminOrderById/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // Cancel order (Admin reject order)
    cancelOrder: builder.mutation<CancelOrderResponse, { id: string; data: RejectOrderFormValues }>({
      query: ({ id, data }) => ({
        url: `/orders/adminCancelOrder/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"]
    }),

    // Accept order
    acceptOrder: builder.mutation<AcceptOrderResponse, string>({
      query: (id: string) => ({
        url: `/orders/acceptOrder/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"]
    }),

    // Edit order
    editOrder: builder.mutation<EditOrderResponse, { id: string; data: EditOrderPayload }>({
      query: ({ id, data }) => ({
        url: `/orders/editOrder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders"]
    }),


    // Get all clients
    // Get all clients with search support
    getAllClients: builder.query<GetAllClientResponse, GetAllClientParams | void>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.search) queryParams.append('search', params.search);
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
        }

        return {
          url: `/users/getAllClients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["Clients"],
    }),

    // Delete client
    deleteClient: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: (body) => ({
        url: `/users/deleteClient`,
        method: "POST",
        body, // contains { id }
      }),
      invalidatesTags: ["Clients"],
    }),

  }),
});

export const {
  useGetAllOrdersQuery,
  useGetAdminOrderByIdQuery,
  useCancelOrderMutation,
  useAcceptOrderMutation,
  useEditOrderMutation,
  useGetAllClientsQuery,
  useDeleteClientMutation,
} = ordersApi;