// incidentsApi.ts
import { baseApi } from "./baseApi";

// ---- Interfaces for Incident Structure ----
export interface IncidentReporter {
  id: string;
  name: string;
}

export interface IncidentShift {
  id: string;
  type: string;
}

export interface Incident {
  id: string;
  name: string;
  location: string; // ← STRING, not object
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shiftId: string;
  reportedBy: string;
  assignedGuard: string | null;
  assignedGuardUser: any | null;
  reporter: IncidentReporter;
  shift: IncidentShift;

  // For UI convenience (these don't exist in API, added for display)
  site?: string;
  type?: string;
  severity?: string;
  status?: string;
  assigned?: string;
  time?: string;
  priorityLevel?: string;
  guardMessage?: string;
  actionsTaken?: string;
  reporterName?: string;
  photo?: string;
  clientNotified?: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface GetAllIncidentsResponse {
  success: boolean;
  message: string;
  data: Incident[];
  pagination: Pagination;
}

export interface GetIncidentByIdResponse {
  success: boolean;
  message: string;
  data: Incident;
}

// ---- Query Params for filtering pagination ----
export interface GetAllIncidentsParams {
  limit?: number;
  page?: number;
  status?: string;
  type?: string;
  severity?: string;
  search?: string;
}

export const incidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ---- FETCH ALL INCIDENTS ----
    getAllIncidents: builder.query<GetAllIncidentsResponse, GetAllIncidentsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.status) queryParams.append("status", params.status);
          if (params.type) queryParams.append("type", params.type);
          if (params.severity) queryParams.append("severity", params.severity);
          if (params.search) queryParams.append("search", params.search);
        }

        return {
          url: `/incidents/getAllIncidentsForAdmin${queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`,
          method: "GET",
        };
      },
      transformResponse: (response: any): GetAllIncidentsResponse => {
        const mappedData = response.data.map((i: any) => ({
          // ✅ Real API fields
          id: i.id,
          name: i.name,
          location: i.location,
          description: i.description,
          images: i.images || [],
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          deletedAt: i.deletedAt,
          shiftId: i.shiftId,
          reportedBy: i.reportedBy,
          assignedGuard: i.assignedGuard,
          assignedGuardUser: i.assignedGuardUser,
          reporter: i.reporter || { id: "", name: "Unknown" },
          shift: i.shift || { id: "", type: "Unknown" },

          // ✅ UI convenience fields
          site: i.name || "Unknown Site",
          type: i.name || "Incident",
          severity: i.severity || "Low",
          status: i.status || "Pending",
          assigned: i.reporter ? i.reporter.name : "Not Assigned",
          time: i.createdAt,
          priorityLevel: i.priorityLevel || "Normal",
          guardMessage: i.guardMessage || "",
          actionsTaken: i.actionsTaken || "",
          reporterName: i.reporter?.name || "Unknown Reporter",
          photo: i.images?.[0] || "",
          clientNotified: i.clientNotified || false,
        }));

        return {
          ...response,
          data: mappedData,
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map((item) => ({
              type: "Incidents" as const,
              id: item.id,
            })),
            { type: "Incidents", id: "LIST" },
          ]
          : [{ type: "Incidents", id: "LIST" }],
    }),

    // ---- GET ONE INCIDENT BY ID ----
    getIncidentById: builder.query<GetIncidentByIdResponse, string>({
      query: (id) => ({
        url: `/incidents/getIncidentByIdForAdmin/${id}`,
        method: "GET",
      }),
      transformResponse: (res: any): GetIncidentByIdResponse => {
        const i = res.data;

        const mapped: Incident = {
          // ✅ Real API fields (exactly as they come from API)
          id: i.id,
          name: i.name,
          location: i.location,
          description: i.description,
          images: i.images || [],
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          deletedAt: i.deletedAt,
          shiftId: i.shiftId,
          reportedBy: i.reportedBy,
          assignedGuard: i.assignedGuard,
          assignedGuardUser: i.assignedGuardUser,
          reporter: i.reporter || { id: "", name: "Unknown" },
          shift: i.shift || { id: "", type: "Unknown" },

          // ✅ UI convenience fields (for backward compatibility)
          site: i.name || "Unknown Site",
          type: i.name || "Incident",
          severity: i.severity || "Medium",
          status: i.status || "Pending",
          assigned: i.reporter ? i.reporter.name : "Not Assigned",
          time: i.createdAt,
          priorityLevel: i.priorityLevel || "Normal",
          guardMessage: i.guardMessage || i.description || "",
          actionsTaken: i.actionsTaken || "",
          reporterName: i.reporter?.name || "Unknown Reporter",
          photo: i.images?.[0] || "",
          clientNotified: i.clientNotified !== undefined ? i.clientNotified : true,
        };

        return { ...res, data: mapped };
      },
      providesTags: (_result, _error, id) => [
        { type: "Incidents", id },
      ],
    }),
  }),
});

// ---- Export Hooks ----
export const {
  useGetAllIncidentsQuery,
  useGetIncidentByIdQuery,
} = incidentsApi;
