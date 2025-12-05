// guardsApi.ts
import { baseApi } from "./baseApi";

// Basic guard interface (from getAllGuards)
export interface Guard {
  roles: never[];
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  serviceType: string;
  locationAddress: string;
  status: string;
}

export interface LatestStatic {
  id: string;
  orderId: string;
  type: string;
  status: string;
  description: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Order: Order;
}

export interface CreateGuardAdminRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  mobile?: string;
  avatar?: string;
}

export interface CreateGuardAdminResponse {
  success: boolean;
  message: string;
  guard?: Guard;
}


// Extended guard interface with latest static (from getGuardById)
export interface GuardWithStatic extends Guard {
  latestStatic: LatestStatic | null;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Response interfaces
export interface GetAllGuardsResponse {
  success: boolean;
  message: string;
  data: Guard[];
  pagination: Pagination;
}

export interface GetGuardByIdResponse {
  success: boolean;
  message: string;
  data: GuardWithStatic;
}

// Query parameters interface for getAllGuards
export interface GetAllGuardsParams {
  limit?: number;
  page?: number;
  search?: string;
}

export const guardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGuards: builder.query<GetAllGuardsResponse, GetAllGuardsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params) {
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.search) queryParams.append('search', params.search);
        }
        
        return {
          url: `/users/getAllGuards${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["Guards"],
    }),

    getGuardById: builder.query<GetGuardByIdResponse, string>({
      query: (id: string) => ({
        url: `/users/getGuardById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Guards", id }],
    }),

    createGuardByAdmin: builder.mutation<CreateGuardAdminResponse, CreateGuardAdminRequest>({
  query: (body) => ({
    url: "/users/createGuardByAdmin",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Guards"],
}),

  }),
});

export const { useGetAllGuardsQuery, useGetGuardByIdQuery, useCreateGuardByAdminMutation, } = guardsApi;