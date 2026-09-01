import { Alarm } from "@/types";
import { baseApi } from "./baseApi";
export interface AlarmGuardPivot {
  id: string;
  status: string;
  assignedAt: string;
  arrivedAt?: string | null;
  completedAt?: string | null;
  alarmId: string;
  guardId: string;
}

export interface AlarmGuard {
  id: string;
  name: string;
  email: string;
  AlarmGuards: AlarmGuardPivot;
}

export type AlarmSummary = {
  active: number;
  critical: number;
  slaBreach: number;
  highPriority: number;
  resolved: number;
};

export interface GetAllAlarmsResponse {
  success: boolean;
  count: number;
  data: Alarm[];
  summary: AlarmSummary;
}

export interface CreateAlarmResponse {
  success: boolean;
  message: string;
  type: string;
  data: {
    alarm: Alarm;
    patrol: {
      patrolRunId: string;
      patrolId: string;
    };
    guards: any[];
    alarmGuards: any[];
  };
}

export interface CreateAlarmPayload {
  title: string;
  description?: string;
  alarmType: string;
  priority: string;
  siteId: string;
  specificLocation?: string;
  guardIds: string[];
  etaMinutes?: number;
  slaTimeMinutes: number;
  monitoringCompany: string;
  license: string;
  unitPrice: number;
  price: number;
}

interface GetAlarmParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  priority?: string;
  userId?: string;
}

export interface DeleteAlarmResponse {
  success: boolean;
  message: string;
  data?: {
    alarmId: string;
    title?: string;
  };
}

export const alarmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlarm: builder.mutation({
      query: (data) => ({
        url: `/alarm/createAlarm`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: [{ type: "Alarms", id: "LIST" }],
    }),
    getAllAlarms: builder.query<GetAllAlarmsResponse, GetAlarmParams>({
      query: (params = {}) => {
        const qs = new URLSearchParams();

        if (params.page) qs.set("page", params.page);
        if (params.limit) qs.set("limit", params.limit);
        if (params.search) qs.set("search", params.search);
        if (params.status) qs.set("status", params.status);
        if (params.priority) qs.set("priority", params.priority);
        if (params.userId) qs.set("userId", params.userId);

        return `/alarm/getAllAlarms?${qs.toString()}`;
      },

      providesTags: [{ type: "Alarms", id: "LIST" }],
    }),
    deleteAlarm: builder.mutation<DeleteAlarmResponse, string>({
      query: (alarmId) => ({
        url: `/alarm/deleteAlarm/${alarmId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Alarms", id: "LIST" }],
    }),
    exportAlarms: builder.mutation({
      query: () => ({
        url: "/alarm/export",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Alarms"],
    }),
  }),
});

export const {
  useCreateAlarmMutation,
  useGetAllAlarmsQuery,
  useDeleteAlarmMutation,
  useExportAlarmsMutation,
} = alarmsApi;
