import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://vigilo-backend-1.onrender.com/api/v1",
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
