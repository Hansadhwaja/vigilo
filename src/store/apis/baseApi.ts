import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "../slices/authSlice";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(clearCredentials());

    // Redirect to login
    window.location.replace("/login");
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
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
    "Invoice",
    "GuardPayment",
    "Plans",
    "Transaction",
    "Vehicle",
    "Dashboard",
  ],
  endpoints: () => ({}),
});
