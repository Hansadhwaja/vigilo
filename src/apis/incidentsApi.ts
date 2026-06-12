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
      providesTags: ["Incidents"],
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
