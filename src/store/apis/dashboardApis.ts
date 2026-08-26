import { DashboardStatsResponse } from "@/types/dashboard/dashboard.types";
import { baseApi } from "./baseApi";

export const dashboardApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<DashboardStatsResponse, void>({
      query: () => "/users/dashboard-metrics",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardMetricsQuery } = dashboardApis;
