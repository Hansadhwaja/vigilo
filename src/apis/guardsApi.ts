// guardsApi.ts
import { baseApi } from "./baseApi";

// Basic guard interface
export interface Guard {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  createdAt: string;
}

// Order interface for activity
export interface ActivityOrder {
  serviceType: string;
  locationName: string;
  locationAddress: string;
}

// Timesheet interface
export interface Timesheet {
  clockInTime: string | null;
  clockOutTime: string | null;
  totalHours: number;
  overtime: {
    startTime: string;
    endTime: string;
    hours: number;
  };
}

// Activity interface (shift history)
export interface Activity {
  shiftId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftStatus: string;
  order: ActivityOrder;
  assignmentStatus: string;
  timesheet: Timesheet;
}

// ✅ CORRECT: Guard details response with activity array
export interface GuardDetailsData {
  guard: Guard;
  activity: Activity[];
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

// ✅ CORRECT: This matches your API response
export interface GetGuardByIdResponse {
  success: boolean;
  message: string;
  data: GuardDetailsData;
}

// Query parameters
export interface GetAllGuardsParams {
  limit?: number;
  page?: number;
  search?: string;
}

// Create guard request
export interface CreateGuardAdminRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
  mobile?: string;
}

export interface CreateGuardAdminResponse {
  success: boolean;
  message: string;
  guard?: Guard;
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

export const { 
  useGetAllGuardsQuery, 
  useGetGuardByIdQuery, 
  useCreateGuardByAdminMutation 
} = guardsApi;
