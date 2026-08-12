import {
  AdminPatrolRunDetailsResponse,
  ApiMessageResponse,
  CreateCheckpointRequest,
  CreateCheckpointResponse,
  CreatePatrolRunRequest,
  CreatePatrolRunResponse,
  CreatePatrolSiteRequest,
  CreatePatrolSiteResponse,
  CreateSubSiteRequest,
  CreateSubSiteResponse,
  DownloadQRParams,
  DownloadSiteQRsPdfParams,
  EditPatrolRunArgs,
  EditPatrolRunResponse,
  GetAllPatrolCheckpointsParams,
  GetAllPatrolCheckpointsResponse,
  GetAllPatrolRunsForAdminResponse,
  GetAllPatrolSitesResponse,
  GetAllPatrolSubSitesParams,
  GetAllPatrolSubSitesResponse,
  GetPatrolParams,
} from "@/types/patrolling/patrolling.types";
import { baseApi } from "./baseApi";

export const patrollingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =================================================
       CREATE SITE
    ================================================= */

    createPatrolSite: builder.mutation<
      CreatePatrolSiteResponse,
      CreatePatrolSiteRequest
    >({
      query: (body) => ({
        url: "/patrolling/createPatrolSite",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       CREATE SUB-SITE
    ================================================= */

    createSubSite: builder.mutation<
      CreateSubSiteResponse,
      CreateSubSiteRequest
    >({
      query: (body) => ({
        url: "/patrolling/createPatrolSubSite",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       GET ALL SITES
    ================================================= */

    getAllPatrolSites: builder.query<
      GetAllPatrolSitesResponse,
      {
        page?: string;
        limit?: string;
        clientId?: string;
      }
    >({
      query: ({ page, limit, clientId } = {}) => {
        const params = new URLSearchParams();

        if (page) params.set("page", page);
        if (limit) params.set("limit", limit);
        if (clientId) params.set("clientId", clientId);

        const queryString = params.toString();

        return queryString
          ? `/patrolling/getAllPatrolSites?${queryString}`
          : "/patrolling/getAllPatrolSites";
      },

      providesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       CREATE CHECKPOINT
    ================================================= */

    createCheckpoint: builder.mutation<
      CreateCheckpointResponse,
      CreateCheckpointRequest
    >({
      query: (body) => ({
        url: "/patrolling/createCheckpoint",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: CreateCheckpointResponse,
      ): CreateCheckpointResponse => response,

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       CREATE PATROL RUN
    ================================================= */

    createPatrolRun: builder.mutation<
      CreatePatrolRunResponse,
      CreatePatrolRunRequest
    >({
      query: (body) => ({
        url: "/patrolling/createPatrolRun",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       DELETE SITE
    ================================================= */

    deletePatrolSite: builder.mutation<ApiMessageResponse, string>({
      query: (siteId) => ({
        url: `/patrolling/deletePatrolSite/${siteId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       DELETE SUB-SITE
    ================================================= */

    deletePatrolSubSite: builder.mutation<ApiMessageResponse, string>({
      query: (subSiteId) => ({
        url: `/patrolling/deletePatrolSubSite/${subSiteId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       DELETE CHECKPOINT
    ================================================= */

    deleteCheckpoint: builder.mutation<ApiMessageResponse, string>({
      query: (checkpointId) => ({
        url: `/patrolling/deleteCheckpoint/${checkpointId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       DELETE PATROL RUN
    ================================================= */

    deletePatrolRun: builder.mutation<ApiMessageResponse, string>({
      query: (patrolId) => ({
        url: `/patrolling/deletePatrolRun/${patrolId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       GET ALL PATROL RUNS - ADMIN
    ================================================= */

    getAllPatrolRunsForAdmin: builder.query<
      GetAllPatrolRunsForAdminResponse,
      GetPatrolParams
    >({
      query: ({ page = 1, limit = 10, status, search } = {}) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (status) params.set("status", status);
        if (search) params.set("search", search);

        return `/patrolling/getAllPatrolRunsForAdmin?${params.toString()}`;
      },

      providesTags: [{ type: "Patrol", id: "LIST" }],
    }),

    /* =================================================
       GET PATROL RUN BY ID - ADMIN
    ================================================= */

    getPatrolRunByIdForAdmin: builder.query<
      AdminPatrolRunDetailsResponse,
      string
    >({
      query: (patrolRunId) => ({
        url: `/patrolling/getPatrolRunByIdForAdmin/${patrolRunId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Patrol", id }],
    }),

    /* =================================================
       EDIT PATROL RUN
    ================================================= */

    editPatrolRun: builder.mutation<EditPatrolRunResponse, EditPatrolRunArgs>({
      query: ({ id, data }) => ({
        url: `/patrolling/editPatrolRun/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Patrol", id },
        { type: "Patrol", id: "LIST" },
      ],
    }),

    /* =================================================
       GET ALL SUB-SITES
    ================================================= */

    getAllPatrolSubSites: builder.query<
      GetAllPatrolSubSitesResponse,
      GetAllPatrolSubSitesParams
    >({
      query: ({ page = 1, limit = 10, siteId } = {}) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (siteId) {
          params.set("siteId", siteId);
        }

        return {
          url: `/patrolling/getAllPatrolSubSites?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: [{ type: "Patrol", id: "SUBSITE_LIST" }],
    }),

    /* =================================================
       GET ALL CHECKPOINTS
    ================================================= */

    getAllPatrolCheckpoints: builder.query<
      GetAllPatrolCheckpointsResponse,
      GetAllPatrolCheckpointsParams
    >({
      query: ({ page = 1, limit = 10, siteId, subSiteId } = {}) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (siteId) {
          params.set("siteId", siteId);
        }

        if (subSiteId) {
          params.set("subSiteId", subSiteId);
        }

        return {
          url: `/patrolling/getAllPatrolCheckpoints?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: [{ type: "Patrol", id: "CHECKPOINT_LIST" }],
    }),

    /* =================================================
       DOWNLOAD QR
    ================================================= */

    downloadQR: builder.query<Blob, DownloadQRParams>({
      query: ({ url, name }) => ({
        url: `/patrolling/downloadQR?url=${encodeURIComponent(
          url,
        )}&name=${encodeURIComponent(name)}`,

        method: "GET",

        responseHandler: async (response) => response.blob(),
      }),
    }),

    /* =================================================
       DOWNLOAD SITE QRS PDF
    ================================================= */

    downloadSiteQRsPdf: builder.query<Blob, DownloadSiteQRsPdfParams>({
      query: ({ siteId }) => ({
        url: `/patrolling/downloadSiteQRsPdf/${siteId}`,
        method: "GET",

        responseHandler: async (response) => response.blob(),
      }),
    }),

    /* =================================================
       EXPORT PATROLS
    ================================================= */

    exportPatrols: builder.mutation<Blob, void>({
      query: () => ({
        url: "/patrolling/export",
        method: "GET",

        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useCreatePatrolSiteMutation,
  useCreateSubSiteMutation,
  useGetAllPatrolSitesQuery,
  useCreateCheckpointMutation,
  useCreatePatrolRunMutation,

  useDeletePatrolSiteMutation,
  useDeletePatrolSubSiteMutation,
  useDeleteCheckpointMutation,
  useDeletePatrolRunMutation,

  useGetAllPatrolRunsForAdminQuery,
  useGetPatrolRunByIdForAdminQuery,

  useEditPatrolRunMutation,

  useGetAllPatrolSubSitesQuery,
  useGetAllPatrolCheckpointsQuery,

  useLazyDownloadQRQuery,
  useLazyDownloadSiteQRsPdfQuery,

  useExportPatrolsMutation,
} = patrollingApi;
