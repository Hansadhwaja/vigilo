import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Guards",
    "Incidents",
    "Alarms",
    "Patrol",
    "Shifts",
    "Orders",
    "Schedules",
    "Clients",
    "Profile",
    "Notifications",
    "Messages",
    "Presence",
  ],
  endpoints: () => ({}), // will extend in separate files
});
