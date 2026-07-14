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

export type ScheduleSummary = {
  activeNow: number;
  patrols: number;
  thisWeek: number;
  today: number;
}


export interface GetAllSchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
  summary: ScheduleSummary;
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

export interface GetScheduleParams {
  page?: number;
  limit?: number;
  search?: string;
  guardId?: string;
  orderId?: string;
  role?: string;
}

export const schedulingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllSchedules: builder.query<GetAllSchedulesResponse, GetScheduleParams | void>({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        if (params) {
          if (params.limit) qs.set('limit', params.limit.toString());
          if (params.page) qs.set('page', params.page.toString());
          if (params.search) qs.set('search', params.search);
          if (params.guardId) qs.set('guardId', params.guardId);
          if (params.orderId) qs.set('orderId', params.orderId);
          if (params.role) qs.set('role', params.role);

        }
        return `/scheduling/getAllSchedules?${qs.toString()}`
      },
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

    getAllTimeSheets: builder.query({
      query: (params = {}) => {
        const { guardId, fromDate, toDate, page, limit, search } = params;
        const qs = new URLSearchParams();
        if (guardId) qs.set("guardId", guardId);
        if (fromDate) qs.set("fromDate", fromDate);
        if (toDate) qs.set("toDate", toDate);
        if (search) qs.set("search", search);
        if (page) qs.set("page", page);
        if (limit) qs.set("limit", limit);
        return `/scheduling/getTimeSheets?${qs.toString()}`
      },

      providesTags: ["Schedules"],
    }),

    editTimeSheet: builder.mutation({
      query: ({ id, data }) => ({
        url: `/scheduling/timesheet/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Schedules"],

    }),

    getGuardTimeSheetSummary: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        if (params.guardId) qs.set("guardId", params.guardId);
        if (params.fromDate) qs.set("fromDate", params.fromDate);
        if (params.toDate) qs.set("toDate", params.toDate);
        if (params.details) qs.set("details", params.details);

        return `/scheduling/getGuardTimeSheetSummary?${qs.toString()}`
      },
      providesTags: ["Schedules"],
    }),
    exportTimeSheets: builder.mutation({
      query: () => ({
        url: "/scheduling/export-timesheets",
        method: "GET",
        responseHandler: (response) => response.blob(),
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
  useEditScheduleMutation,
  useGetAllTimeSheetsQuery,
  useEditTimeSheetMutation,
  useGetGuardTimeSheetSummaryQuery,
  useExportTimeSheetsMutation
} = schedulingApi;
