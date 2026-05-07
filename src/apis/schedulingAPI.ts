import { baseApi } from "./baseApi";

export interface Schedule {
  id: string;
  orderId: string;
  date: string;
  endDate?: string;
  type: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  guards: Guard[];
  orderLocationAddress: string;
  orderLocationName: string;
  shiftTotalHours: number;
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

export const schedulingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllSchedules: builder.query<GetAllSchedulesResponse, void>({
      query: () => `/scheduling/getAllSchedules`,
      providesTags: ["Schedules"],
    }),
    createSchedule: builder.mutation<CreateScheduleResponse, CreateScheduleDto>({
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

    editSchedule: builder.mutation<UpdateScheduleResponse, { id: string; data: UpdateScheduleDto }>({
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

export const {
  useGetAllSchedulesQuery,
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetStaticShiftDetailsForAdminQuery,
  useEditScheduleMutation
} = schedulingApi;
