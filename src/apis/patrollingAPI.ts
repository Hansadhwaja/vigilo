// patrollingAPI.ts
import { baseApi } from "./baseApi";

/* =====================================================
   📌 INTERFACES
===================================================== */

// ---- Create Patrol Site Request ----
export interface CreatePatrolSiteRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  clientId: string;
  description?: string;
}

// ---- Patrol Site Response Structure ----
export interface PatrolSite {
  id: string;
  status: string;
  isActive: boolean;
  isCompleted: boolean;
  totalSubSites: number;
  totalCheckpoints: number;
  createdBy: string;
  clientId: string;
  name: string;
  address: string;
  latitude: string; // API returns string
  longitude: string; // API returns string
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ---- API Response ----
export interface CreatePatrolSiteResponse {
  success: boolean;
  message: string;
  data: PatrolSite;
}

/* =====================================================
   📌 CREATE SUB-SITE INTERFACES
===================================================== */

// ---- Create SubSite Request ----
export interface CreateSubSiteRequest {
  siteId: string;
  name: string;
  unitPrice: number;
  estimatedDuration: number;
  description?: string;
}

// ---- SubSite Response Structure ----
export interface SubSite {
  id: string;
  status: string;
  isCompleted: boolean;
  totalCheckpoints: number;
  siteId: string;
  name: string;
  unitPrice: string; // backend returns string "150.00"
  estimatedDuration: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ---- API Response ----
export interface CreateSubSiteResponse {
  success: boolean;
  message: string;
  data: SubSite;
}

export interface QRData {
  id: string;
  qrUrl: string;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface PatrolCheckpoint {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  verificationRange: number;
  priorityLevel: "low" | "medium" | "high";
  status: string;
  createdAt: string;
  qr?: QRData | null;
}

export interface PatrolSubSiteWithCheckpoints {
  id: string;
  name: string;
  unitPrice: string;
  estimatedDuration: number;
  status: string;
  createdAt: string;
  checkpoints: PatrolCheckpoint[];
}

export interface PatrolClient {
  id: string;
  name: string;
  email: string;
}

export interface PatrolSiteFull {
  id: string;
  createdBy: string;
  clientId: string;
  name: string;
  address: string;
  status: string;
  latitude: string;
  longitude: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  totalSubSites: number;
  totalCheckpoints: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  subSites: PatrolSubSiteWithCheckpoints[];
  checkpoints: PatrolCheckpoint[];
  client: PatrolClient;
}

export interface GetAllPatrolSitesResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: PatrolSiteFull[];
}

export interface CreateCheckpointRequest {
  siteId?: string;      // optional
  subSiteId?: string;   // optional
  name: string;
  latitude: number;
  longitude: number;
  verificationRange: number;
  priorityLevel: "low" | "medium" | "high";
  description?: string;
}

export interface CreateCheckpointResponse {
  success: boolean;
  message: string;
  data: {
    checkpoint: PatrolCheckpoint;
    qr: QRData;
  };
}

export interface CreatePatrolRunResponse {
  success: boolean;
  type: string;
  data: {
    patrol: Patrol;
    order: PatrolOrder;
    guards: PatrolGuard[];
    sites: PatrolSite[];
  };
}

export interface Patrol {
  id: string;
  patrolId: string;
  vehicleId: string;
  description: string;
  status: string;
  startTime: string;
  endTime: string;
  totalSites: number;
  totalSubSites: number;
  totalCheckpoints: number;
  completedSites: number;
  completedSubSites: number;
  completedCheckpoints: number;
    unitPrice: number;         // ✅ added
  totalHours: number;        // ✅ added
  totalPatrolCost: number;   // ✅ added
  perGuardPayment: number;
}

export interface PatrolOrder {
  id: string;
  serviceType: string;
  locationName: string;
  locationAddress: string;
  guardsRequired: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  images: string[];
  userId: string;
    createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PatrolGuard {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  isVerified: boolean;
  blocked: boolean;
  avatar?: string | null;
}

export interface PatrolCheckpoint {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  verificationRange: number;
  priorityLevel: "low" | "medium" | "high";
  description: string;
  status: string;
  scannedAt: string | null;
  scannedBy: string | null;
}

export interface PatrolSubSite {
  id: string;
  name: string;
  unitPrice: string;
  estimatedDuration: number;
  description: string;
  status: string;
  checkpoints: PatrolCheckpoint[];
}

export interface PatrolSite {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string;
  status: string;
  subSites: PatrolSubSite[];
  checkpoints: PatrolCheckpoint[];
}

/* =====================================================
   📌 CREATE PATROL RUN INTERFACES
===================================================== */

export interface CreatePatrolRunRequest {
  patrolId: string;
  orderId: string;
  guardIds:   string[];
  unitPrice: number; 
  vehicleId: string;
  startDateTime: string;
  estimatedCompletion: string;
  notes?: string;
  siteIds: string[];
}

export interface AdminPatrolGuard {
  id: string;
  name: string;
  status: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  totalHours: number | null;
}

export interface AdminPatrolRun {
  id: string;
  patrolId: string;
  status: string;
  vehicleId: string;
  clientName: string;
  clientEmail: string;
  locationName: string;
  orderStartTime: string;
  orderStartDate: string;
  orderStatus: string;

  totalSites: number;
  completedSites: number;
  totalSubSites: number;
  completedSubSites: number;
  totalCheckpoints: number;
  completedCheckpoints: number;
  completionPercentage: number;
  hasDeviation: boolean;

  startDateTime: string;
  estimatedCompletion: string;

  guards: AdminPatrolGuard[];
}

export interface GetAllPatrolRunsForAdminResponse {
  success: boolean;
  total: number;
  data: AdminPatrolRun[];
}

/* =====================================================
   📌 GET PATROL RUN BY ID (ADMIN)
===================================================== */

export interface AdminPatrolRunDetailsResponse {
  success: boolean;
  type: string;
  data: {
    patrol: {
      id: string;
      patrolId: string;
      vehicleId: string;
      description: string | null;
      status: string;
      startTime: string;
      estimatedCompletion: string;
      completionPercentage: number;
      totalSites: number;
      completedSites: number;
      totalSubSites: number;
      completedSubSites: number;
      totalCheckpoints: number;
      completedCheckpoints: number;
      missedCheckpoints: number;
      hasDeviation: boolean;
      createdAt: string;
      updatedAt: string;
    };

    order: {
      id: string;
      locationName: string;
      locationAddress: string;
      images: string[];
      serviceType: string;
      startDate: string;
      startTime: string;
      status: string;
      user: {
        id: string;
        name: string;
        email: string;
        mobile: string;
      };
    };

    client: {
      id: string;
      name: string;
      email: string;
      mobile: string;
      avatar?: string | null;
    };

    guards: {
      id: string;
      name: string;
      email: string;
      guardStatus: string;
      clockInTime: string | null;
      clockOutTime: string | null;
      overtimeStartTime: string | null;
      overtimeEndTime: string | null;
      overtimeHours: number | null;
      totalHours: number | null;
      assignedAt: string;
    }[];

    sites: PatrolSite[];
  };
}

/* =====================================================
   📌 EDIT PATROL RUN
===================================================== */

export interface EditPatrolRunRequest {
  startDateTime?: string;
  estimatedCompletion?: string;
  addSites?: string[];
  removeSiteIds?: string[];
  addSubSites?: Array<{
    parentSiteId: string;
    subSiteId: string;
  }>;
  removeSubSiteIds?: string[];
  addCheckpoints?: Array<{
    parentType: "site" | "subSite";
    parentId: string;
    checkpointId: string;
  }>;
  removeCheckpointIds?: string[];
  updateSites?: Array<{
    siteId?: string;
    id?: string;
    name?: string;
    address?: string;
    latitude?: string | number;
    longitude?: string | number;
    description?: string;
    status?: string;
  }>;
  updateSubSites?: Array<{
    subSiteId?: string;
    id?: string;
    name?: string;
    description?: string;
    status?: string;
    unitPrice?: string | number;
    estimatedDuration?: string | number;
    latitude?: string | number;
    longitude?: string | number;
  }>;
  updateCheckpoints?: Array<{
    checkpointId?: string;
    id?: string;
    name?: string;
    latitude?: string | number;
    longitude?: string | number;
    verificationRange?: string | number;
    priorityLevel?: "low" | "medium" | "high";
    description?: string;
    status?: string;
  }>;
  guardIds?: string[];
}

export interface EditPatrolRunResponse {
  success: boolean;
  message: string;
}

export interface GetAllPatrolSubSitesResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: any[]; // you can strongly type this later
}

export interface GetAllPatrolCheckpointsResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: any[];
}
/* =====================================================
   🚓 PATROLLING API
===================================================== */

export const patrollingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ===============================
    // 🟢 CREATE PATROL SITE
    // ===============================
    createPatrolSite: builder.mutation<
      CreatePatrolSiteResponse,
      CreatePatrolSiteRequest
    >({
      query: (body) => ({
        url: "/patrolling/createPatrolSite", // 🔥 adjust if your backend route differs
        method: "POST",
        body,
      }),

      transformResponse: (response: any): CreatePatrolSiteResponse => {
        const site = response.data;

        const mapped: PatrolSite = {
          id: site.id,
          status: site.status,
          isActive: site.isActive,
          isCompleted: site.isCompleted,
          totalSubSites: site.totalSubSites,
          totalCheckpoints: site.totalCheckpoints,
          createdBy: site.createdBy,
          clientId: site.clientId,
          name: site.name,
          address: site.address,
          latitude: site.latitude,
          longitude: site.longitude,
          description: site.description,
          createdAt: site.createdAt,
          updatedAt: site.updatedAt,
          deletedAt: site.deletedAt,
          subSites: [],
          checkpoints: []
        };

        return {
          ...response,
          data: mapped,
        };
      },

      invalidatesTags: [{ type: "Patrol", id: "LIST" }],
    }),
    // ===============================
// 🟢 CREATE SUB SITE
// ===============================
createSubSite: builder.mutation<
  CreateSubSiteResponse,
  CreateSubSiteRequest
>({
  query: (body) => ({
    url: "/patrolling/createPatrolSubSite", // adjust if route differs
    method: "POST",
    body,
  }),

  transformResponse: (response: any): CreateSubSiteResponse => {
    const subSite = response.data;

    const mapped: SubSite = {
      id: subSite.id,
      status: subSite.status,
      isCompleted: subSite.isCompleted,
      totalCheckpoints: subSite.totalCheckpoints,
      siteId: subSite.siteId,
      name: subSite.name,
      unitPrice: subSite.unitPrice,
      estimatedDuration: subSite.estimatedDuration,
      description: subSite.description,
      createdAt: subSite.createdAt,
      updatedAt: subSite.updatedAt,
      deletedAt: subSite.deletedAt,
    };

    return {
      ...response,
      data: mapped,
    };
  },

  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),
// ===============================
// 🟢 GET ALL PATROL SITES
// ===============================
getAllPatrolSites: builder.query<
  GetAllPatrolSitesResponse,
  { page?: number; limit?: number }
>({
  query: ({ page = 1, limit = 10 }) => ({
    url: `/patrolling/getAllPatrolSites?page=${page}&limit=${limit}`,
    method: "GET",
  }),

  providesTags: [{ type: "Patrol", id: "LIST" }],
}),

// ===============================
// 🟢 CREATE CHECKPOINT
// ===============================
createCheckpoint: builder.mutation<
  CreateCheckpointResponse,
  CreateCheckpointRequest
>({
  query: (body) => ({
    url: "/patrolling/createCheckpoint", // adjust if needed
    method: "POST",
    body,
  }),

  transformResponse: (response: any): CreateCheckpointResponse => {
    const checkpoint = response.data.checkpoint;
    const qr = response.data.qr;

    const mappedCheckpoint: PatrolCheckpoint = {
      id: checkpoint.id,
      name: checkpoint.name,
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
      verificationRange: checkpoint.verificationRange,
      priorityLevel: checkpoint.priorityLevel,
      status: checkpoint.status,
      createdAt: checkpoint.createdAt,
      description: checkpoint.description || "",
      scannedAt: checkpoint.scannedAt || null,
      scannedBy: checkpoint.scannedBy || null,
      qr: {
        id: qr.id,
        qrUrl: qr.qrUrl,
        latitude: qr.latitude,
        longitude: qr.longitude,
        createdAt: qr.createdAt,
      },
    };

    return {
      success: response.success,
      message: response.message,
      data: {
        checkpoint: mappedCheckpoint,
        qr: mappedCheckpoint.qr!,
      },
    };
  },

  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),

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
// ===============================
// 🔴 DELETE PATROL SITE
// ===============================
deletePatrolSite: builder.mutation<
  { success: boolean; message: string },
  string
>({
  query: (siteId) => ({
    url: `/patrolling/deletePatrolSite/${siteId}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),

// ===============================
// 🔴 DELETE PATROL SUB SITE
// ===============================
deletePatrolSubSite: builder.mutation<
  { success: boolean; message: string },
  string
>({
  query: (subSiteId) => ({
    url: `/patrolling/deletePatrolSubSite/${subSiteId}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),

// ===============================
// 🔴 DELETE CHECKPOINT
// ===============================
deleteCheckpoint: builder.mutation<
  { success: boolean; message: string },
  string
>({
  query: (checkpointId) => ({
    url: `/patrolling/deleteCheckpoint/${checkpointId}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),

// ===============================
// 🔴 DELETE PATROL RUN
// ===============================
deletePatrolRun: builder.mutation<
  { success: boolean; message: string },
  string
>({
  query: (patrolId) => ({
    url: `/patrolling/deletePatrolRun/${patrolId}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: "Patrol", id: "LIST" }],
}),
// ===============================
// 🟢 GET ALL PATROL RUNS (ADMIN)
// ===============================
getAllPatrolRunsForAdmin: builder.query<
  GetAllPatrolRunsForAdminResponse,
  {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
>({
  query: ({
    page = 1,
    limit = 10,
    status,
    search,
  }) => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (status && status !== "all") {
      params.append("status", status);
    }

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    return {
      url: `/patrolling/getAllPatrolRunsForAdmin?${params.toString()}`,
      method: "GET",
    };
  },

  providesTags: [{ type: "Patrol", id: "LIST" }],
}),
// ===============================
// 🟢 GET PATROL RUN BY ID (ADMIN)
// ===============================
getPatrolRunByIdForAdmin: builder.query<
  AdminPatrolRunDetailsResponse,
  string
>({
  query: (patrolRunId) => ({
    url: `/patrolling/getPatrolRunByIdForAdmin/${patrolRunId}`,
    method: "GET",
  }),

  providesTags: (result, error, id) => [
    { type: "Patrol", id },
  ],
}),
// ===============================
// 🟡 EDIT PATROL RUN
// ===============================
editPatrolRun: builder.mutation<
  EditPatrolRunResponse,
  { patrolRunId: string; body: EditPatrolRunRequest }
>({
  query: ({ patrolRunId, body }) => ({
    url: `/patrolling/editPatrolRun/${patrolRunId}`,
    method: "PUT",
    body,
  }),

  invalidatesTags: (result, error, arg) => [
    { type: "Patrol", id: arg.patrolRunId },
    { type: "Patrol", id: "LIST" },
  ],
}),
// ===============================
// 🟢 GET ALL PATROL SUB-SITES
// ===============================
getAllPatrolSubSites: builder.query<
  GetAllPatrolSubSitesResponse,
  {
    page?: number;
    limit?: number;
    siteId?: string;
  }
>({
  query: ({
    page = 1,
    limit = 10,
    siteId,
  }) => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (siteId) {
      params.append("siteId", siteId);
    }

    return {
      url: `/patrolling/getAllPatrolSubSites?${params.toString()}`,
      method: "GET",
    };
  },

  providesTags: [{ type: "Patrol", id: "SUBSITE_LIST" }],
}),

// ===============================
// 🟢 GET ALL PATROL CHECKPOINTS
// ===============================
getAllPatrolCheckpoints: builder.query<
  GetAllPatrolCheckpointsResponse,
  {
    page?: number;
    limit?: number;
    siteId?: string;
    subSiteId?: string;
  }
>({
  query: ({
    page = 1,
    limit = 10,
    siteId,
    subSiteId,
  }) => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (siteId) {
      params.append("siteId", siteId);
    }

    if (subSiteId) {
      params.append("subSiteId", subSiteId);
    }

    return {
      url: `/patrolling/getAllPatrolCheckpoints?${params.toString()}`,
      method: "GET",
    };
  },

  providesTags: [{ type: "Patrol", id: "CHECKPOINT_LIST" }],
}),
downloadQR: builder.query<
  Blob,
  { url: string; name: string }
>({
  query: ({ url, name }) => ({
    url: `/patrolling/downloadQR?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`,
    method: "GET",
    responseHandler: async (response) => response.blob(),
  }),
}),
downloadSiteQRsPdf: builder.query<
  Blob,
  { siteId: string }
>({
  query: ({ siteId }) => ({
    url: `/patrolling/downloadSiteQRsPdf/${siteId}`,
    method: "GET",
    responseHandler: async (response) => response.blob(),
  }),
}),
  }),
});

/* =====================================================
   📦 EXPORT HOOK
===================================================== */

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
} = patrollingApi;