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

export interface Alarm {
  id: string;
  title: string;
  description?: string;

  alarmType:
  | "intrusion"
  | "panic"
  | "fire"
  | "medical"
  | "motion"
  | "other";

  priority: "low" | "medium" | "high" | "critical";

  patrolRunId?: string;
  patrolId?: string;

  siteId?: string;
  siteName?: string;
  siteAddress?: string;

  vehicleId?: string;

  specificLocation?: string;

  guardIds: string[];

  etaMinutes?: number;
  slaTimeMinutes: number;
  totalTimeMinutes?: number;

  unitPrice: number;
  price: number;

  status: string;

  monitoringCompany?: string;
  license?: string;


  breach: boolean;

  createdAt: string;
  updatedAt: string;
  guards: AlarmGuard[];
}

export interface GetAllAlarmsResponse {
  success: boolean;
  count: number;
  data: Alarm[];
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
    getAllAlarms: builder.query<GetAllAlarmsResponse, void>({
      query: () => ({
        url: `/alarm/getAllAlarms`,
        method: "GET",
      }),

      providesTags: [{ type: "Alarms", id: "LIST" }],
    }),
    deleteAlarm: builder.mutation<DeleteAlarmResponse, string>({
      query: (alarmId) => ({
        url: `/alarm/deleteAlarm/${alarmId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Alarms", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateAlarmMutation,
  useGetAllAlarmsQuery,
  useDeleteAlarmMutation,
} = alarmsApi;