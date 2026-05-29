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

export interface IncidentType {
  id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  shiftId: string;
  reportedBy: string;
  assignedGuard: string | null;

  assignedGuardUser: {
    id: string;
    name: string;
  } | null;

  reporter: {
    id: string;
    name: string;
  };

  shift: {
    id: string;
    type: string;
  };
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
  data: IncidentType[];
  pagination: Pagination;
}

export interface GetIncidentByIdResponse {
  success: boolean;
  message: string;
  data: IncidentType;
}


export const incidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllIncidents: builder.query({
      query: (params) => {
        const qs = new URLSearchParams();

        if (params) {
          if (params.limit) qs.append("limit", params.limit.toString());
          if (params.page) qs.append("page", params.page.toString());
          if (params.status) qs.append("status", params.status);
          if (params.search) qs.append("search", params.search);
        }

        return `/incidents/getAllIncidentsForAdmin${qs.toString() ? `?${qs.toString()}` : ""}`

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

    getIncidentById: builder.query({
      query: (id) => ({
        url: `/incidents/getIncidentByIdForAdmin/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Incidents", id },
      ],
    }),

    exportIncidents: builder.mutation({
      query: () => ({
        url: "/incidents/export",
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: ["Incidents"],
    })
  }),
});

export const {
  useGetAllIncidentsQuery,
  useGetIncidentByIdQuery,
  useExportIncidentsMutation
} = incidentsApi;
