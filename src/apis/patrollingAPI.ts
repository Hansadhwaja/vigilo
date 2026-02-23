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
  }),
});

/* =====================================================
   📦 EXPORT HOOK
===================================================== */

export const {
  useCreatePatrolSiteMutation,
} = patrollingApi;