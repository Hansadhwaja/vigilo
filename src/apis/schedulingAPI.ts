// schedulingApi.ts
import { baseApi } from "./baseApi";

// --------------------------------------------------
// Interfaces
// --------------------------------------------------

export interface Schedule {
  id: string;
  orderName: string | null;
  orderId: string;
  date: string;  
  endDate: string;      // optional end date for multi-day schedules
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

export interface Client {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export interface OrderDetails {
  id: any;
  serviceType: string;
  locationName: string;
  locationAddress: string;
  images: string[];
  siteService: {
    crs: {
      type: string;
      properties: {
        name: string;
      };
    };
    type: string;
    coordinates: [number, number];
  };
  guardsRequired: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface GuardTimesheet {
  clockInTime: string | null;
  clockOutTime: string | null;
  totalHours: number;
  overtime: {
    startTime: string | null;
    endTime: string | null;
    hours: number;
  };
}

export interface GuardAssignment {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignmentStatus: string;
  timesheet: GuardTimesheet;
}

export interface ShiftDetails {
  orderId: any;
  id: string;
  type: string;
  description: string;
  date: string;
  endDate: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface ShiftDetailsResponse {
  success: boolean;
  message: string;
  data: {
    shift: ShiftDetails;
    client: Client;
    order: OrderDetails;
    guards: GuardAssignment[];
    incidents: any[];
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
export interface DeleteScheduleResponse {
  success: boolean;
  message: string;
}


export interface UpdateScheduleDto {
  description?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  endDate?: string;
  guardIds?: string[];
}

export interface UpdateScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}

export interface DeleteScheduleDto {
  id: string;
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
          // Map data to a UI-friendly shape while preserving nested fields
          const mapped = response.data.map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            orderName: item.orderLocationAddress || null,
            date: item.date,
            type: item.type,
            description: item.description,
            status: item.status,
            startTime: item.startTime,
            endTime: item.endTime,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt || null,
            deletedAt: item.deletedAt || null,

            // Keep more fields on guards that the UI expects (role, StaticGuards, etc.)
            guards: item.guards?.map((g: any) => ({
              id: g.id,
              name: g.name,
              email: g.email,
              // preserve role if provided by backend
              role: g.role || g.userRole || null,
              // preserve other optional fields the UI may use
              description: g.description ?? null,
              time: g.time ?? null,
              // prefer explicit StaticGuards object if backend provides it
              StaticGuards: g.StaticGuards ?? null,
              // expose a computed status but keep original StaticGuards too
              status: g.StaticGuards?.status ?? g.status ?? "pending",
              assignedAt: g.StaticGuards?.createdAt ?? g.assignedAt ?? null,
            })) || [],
          }));

          return {
            ...response,
            data: mapped,
            pagination: response.pagination || null,
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

    getStaticShiftDetailsForAdmin: builder.query<ShiftDetailsResponse, string>({
      query: (id: string) => ({
        url: `/scheduling/getStaticShiftDetailsForAdmin/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Schedules", id }],
    }),

    // -------------------------------
    // EDIT SCHEDULE
    // -------------------------------
      editSchedule: builder.mutation<
      UpdateScheduleResponse,
      { id: string; data: UpdateScheduleDto }
    >({
      query: ({ id, data }) => ({
        url: `/scheduling/editSchedule/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Schedules",
        { type: "Schedules", id },
      ],
    }),

    // ✅ EXISTING: DELETE SCHEDULE (POST) - Already correct
    deleteSchedule: builder.mutation<DeleteScheduleResponse, DeleteScheduleDto>({
      query: (body) => ({
        url: `/scheduling/deleteSchedule`,
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
  useCreateScheduleMutation,
   useDeleteScheduleMutation,
   useGetStaticShiftDetailsForAdminQuery,
    useEditScheduleMutation
} = schedulingApi;
