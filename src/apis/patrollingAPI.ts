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
  }),
});

/* =====================================================
   📦 EXPORT HOOK
===================================================== */

export const {
  useCreatePatrolSiteMutation,
  useCreateSubSiteMutation,
  useGetAllPatrolSitesQuery,
} = patrollingApi;