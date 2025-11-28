// schedulingApi.ts
import { baseApi } from "./baseApi";

// --------------------------------------------------
// Interfaces
// --------------------------------------------------

export interface Schedule {
  id: string;
  orderId: string;
  date: string;               // "2025-11-28"
  type: string;               // e.g. "static"
  description: string;
  startTime: string;          // ISO date string
  endTime: string;            // ISO date string
  status: string;             // e.g. "upcoming"
  createdAt: string;          // ISO date string

  guards: Guard[];
}

export interface Guard {
  orderId: string;
  description: any;
  time: any;
  status: any;
  role: string;
  id: string;
  name: string;
  email: string;

  StaticGuards: {
    status: string;           // "pending"
    createdAt: string;        // ISO date string
  };
}



export interface CreateScheduleDto {
  description: string;
  date: string;
  orderId: string;
  guardIds: string[]; // guard names
  startTime: string;
  endTime: string;
}

export interface GetAllSchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

export interface CreateScheduleResponse {
  success: boolean;
  message: string;
  data: any;
}

// --------------------------------------------------
// API Module
// --------------------------------------------------

export const schedulingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // -------------------------------
    // GET ALL SCHEDULES
    // -------------------------------
    getAllSchedules: builder.query<GetAllSchedulesResponse, void>({
      query: () => ({
        url: `/scheduling/getAllSchedules`,
        method: "GET",
      }),

      transformResponse: (response: any): GetAllSchedulesResponse => {
        // Map data exactly like guards API does (clean + UI ready)
        const mapped = response.data.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        type: item.type,
        status: item.status,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        createdAt: item.createdAt,

        // Keep full guards array
         guards: item.guards?.map((g: any) => ({
         id: g.id,
         name: g.name,
         email: g.email,
         status: g.StaticGuards?.status || "pending",
         assignedAt: g.StaticGuards?.createdAt || null,
        })) || [],
        }));


        return {
          ...response,
          data: mapped,
        };
      },

      providesTags: ["Schedules"],
    }),

    // -------------------------------
    // CREATE SCHEDULE
    // -------------------------------
    createSchedule: builder.mutation<
      CreateScheduleResponse,
      CreateScheduleDto
    >({
      query: (body) => ({
        url: `/scheduling/createSchedule`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schedules"],
    }),
  }),
});

// --------------------------------------------------
// Export Hooks
// --------------------------------------------------
export const { 
  useGetAllSchedulesQuery, 
  useCreateScheduleMutation 
} = schedulingApi;
