import { baseApi } from "./baseApi";

/* ================================
   Interfaces
================================ */

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

  breach: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ================================
   API Responses
================================ */

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
  unitPrice: number;
  price: number;
}

/* ================================
   RTK Query API
================================ */

export const alarmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================================
       CREATE ALARM
    ================================ */

    createAlarm: builder.mutation<
      CreateAlarmResponse,
      CreateAlarmPayload
    >({
      query: (body) => ({
        url: `/alarm/createAlarm`,
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Alarms", id: "LIST" }],
    }),

  }),
});

/* ================================
   Hooks
================================ */

export const {
  useCreateAlarmMutation,
} = alarmsApi;