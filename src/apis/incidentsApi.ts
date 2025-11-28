// incidentsApi.ts
import { stat } from "fs";
import { baseApi } from "./baseApi";

// ---- Interfaces for Incident Structure ----
export interface IncidentLocation {
  name: string;
  lat?: number;
  lng?: number;
  coordinates:number;
}

export interface Incident {
  id: string;
  site: string;
  type: string;
  severity: string;
  status: string;
  assigned?: string;
  time: string;
  location: IncidentLocation;
  priorityLevel:string;
  guardMessage:string;
  description:string;
  actionsTaken:string;
  reportedBy: string;
  reporterName: string;
  photo:string;
  clientNotified:boolean;

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
  status?: string;   // pending, resolved, in progress
  type?: string;
  severity?: string;
  search?: string;
}

export const incidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ---- FETCH ALL INCIDENTS ----
    getAllIncidents: builder.query<
      GetAllIncidentsResponse,
      GetAllIncidentsParams | void
    >({
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
          url: `/incidents/getAllIncidentsForAdmin${
            queryParams.toString() ? `?${queryParams.toString()}` : ""
          }`,
          method: "GET",
        };
      },
        transformResponse: (response: any): GetAllIncidentsResponse => {
    const mappedData = response.data.map((i: any) => ({
      id: i.id,
      site: i.name || "Unknown Site",
      type: i.name || "Incident",
      severity: i.severity || "Low",
      status: i.status || "Pending",
      assigned: i.reporter
  ? `${i.reporter.name} `
    : "Not Assigned",
      time: i.createdAt,
      location: {
        name: i.location || "Unknown",
        coordinates: 0,
        lat: 0,
        lng: 0,
      },
      priorityLevel: i.priorityLevel || "Normal",
      guardMessage: i.guardMessage || "",
      description: i.description || "",
      actionsTaken: i.actionsTaken || "",
      reportedBy: i.reportedBy || "",
      reporterName: i.reporter
  ? `${i.reporter.name} `
  : "Unknown Reporter",

      photo: i.images?.[0] || "",
      clientNotified: false,
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

    const mapped = {
      id: i.id,
      status: i.status || "Pending",
      type: i.name || "Incident",
      site: i.name || "Unknown Site",
      location: {
        name: i.location || "Unknown",
        coordinates: 0,
        lat: 0,
        lng: 0,
      },
    name: i.name,
    description: i.description,
    images: i.images || [],
    actionsTaken: i.actionsTaken || "Action Tokens",
    time: i.createdAt,
    updatedAt: i.updatedAt,
    deletedAt: i.deletedAt,
    guardMessage: i.guardMessage || i.description || "",
    clientNotified:i.clientNotified || true,

    shiftId: i.shiftId,
    reportedBy: i.reporterName || "",
    assigned: i.reporter
  ? `${i.reporter.name} `
    : "Not Assigned",

    reporter: i.reporter
      ? {
          id: i.reporter.id,
          name: i.reporter.name,
        }
      : null,

    shift: i.shift
      ? {
          id: i.shift.id,
          type: i.shift.type,
        }
      : null,

    // UI-friendly fields
    reporterName: i.reporter?.name || "Unknown Reporter",
    photo: i.images?.[0] || "",
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
