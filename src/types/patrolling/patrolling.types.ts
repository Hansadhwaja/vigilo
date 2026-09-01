export type PriorityLevel = "low" | "medium" | "high";

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

/* =====================================================
   📌 QR
===================================================== */

export interface QRData {
  id: string;
  qrUrl: string;
  latitude: string;
  longitude: string;
  createdAt: string;
}

/* =====================================================
   📌 PATROL CHECKPOINT
===================================================== */

export interface PatrolCheckpoint {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  verificationRange: number;
  priorityLevel: PriorityLevel;
  description: string;
  status: string;
  createdAt?: string;
  scannedAt?: string | null;
  scannedBy?: string | null;
  qr?: QRData | null;
}

/* =====================================================
   📌 PATROL SUB-SITE
===================================================== */

export interface PatrolSubSite {
  id: string;
  name: string;
  unitPrice: number;
  estimatedDuration: number;
  description: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  checkpoints: PatrolCheckpoint[];
}

/* =====================================================
   📌 PATROL SITE
===================================================== */

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
   📌 PATROL SITE - FULL RESPONSE
===================================================== */

export interface PatrolClient {
  id: string;
  name: string;
  email: string;
}

export interface PatrolSiteFull extends PatrolSite {
  createdBy: string;
  clientId: string;

  isActive: boolean;
  isCompleted: boolean;

  totalSubSites: number;
  totalCheckpoints: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

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
   📌 CREATE PATROL SITE
===================================================== */

export interface CreatePatrolSiteRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  clientId: string;
  description?: string;
}

export interface CreatePatrolSiteResponse {
  success: boolean;
  message: string;
  data: Omit<PatrolSiteFull, "subSites" | "checkpoints" | "client">;
}

/* =====================================================
   📌 CREATE SUB-SITE
===================================================== */

export interface CreateSubSiteRequest {
  siteId: string;
  name: string;
  unitPrice: number;
  estimatedDuration: number;
  description?: string;
}

export interface CreatedSubSite extends Omit<PatrolSubSite, "checkpoints"> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateSubSiteResponse {
  success: boolean;
  message: string;
  data: CreatedSubSite;
}

/* =====================================================
   📌 CREATE CHECKPOINT
===================================================== */

export interface CreateCheckpointRequest {
  siteId?: string;
  subSiteId?: string;
  name: string;
  latitude: number;
  longitude: number;
  verificationRange: number;
  priorityLevel: PriorityLevel;
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

/* =====================================================
   📌 PATROL RUN
===================================================== */

export interface Patrol {
  id: string;
  patrolId: string;
  vehicleId: string;
  description: string | null;
  notes?: string | null;
  status: string;

  startTime: string;
  endTime?: string;
  estimatedCompletion?: string;

  totalSites: number;
  totalSubSites: number;
  totalCheckpoints: number;

  completedSites: number;
  completedSubSites: number;
  completedCheckpoints: number;

  missedCheckpoints?: number;
  completionPercentage?: number;

  hasDeviation?: boolean;

  unitPrice?: number;
  totalHours?: number;
  totalPatrolCost?: number;
  perGuardPayment?: number;

  createdAt?: string;
  updatedAt?: string;
}

/* =====================================================
   📌 PATROL ORDER
===================================================== */

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

/* =====================================================
   📌 PATROL GUARD
===================================================== */

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

/* =====================================================
   📌 CREATE PATROL RUN
===================================================== */

export interface CreatePatrolRunRequest {
  patrolName: string;
  patrolId: string;
  orderId: string;

  guardIds: string[];

  unitPrice: number;

  vehicleIds: string[];

  startDateTime: string;
  estimatedCompletion: string;

  notes?: string;

  siteIds: string[];
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

/* =====================================================
   📌 ADMIN PATROL RUN LIST
===================================================== */

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

  guardIds: string[];
  guards: AdminPatrolGuard[];
  sites: PatrolSite[];
}

export interface GetAllPatrolRunsForAdminResponse {
  success: boolean;
  data: AdminPatrolRun[];
  message?: string;

  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };

  summary: {
    active: number;
    pending: number;
    completed: number;
    upcoming: number;
  };
}

export interface GetPatrolParams {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}

/* =====================================================
   📌 ADMIN PATROL RUN DETAILS
===================================================== */

export interface AdminPatrolRunDetails {
  patrol: {
    id: string;
    patrolId: string;

    vehicleIds: string[];

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

    unitPrice: string;
    totalHours: number;
    totalPatrolCost: string;
    perGuardPayment: string;

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

  guards: AdminPatrolRunDetailGuard[];

  sites: PatrolSite[];
}

export interface AdminPatrolRunDetailGuard {
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
}

export interface AdminPatrolRunDetailsResponse {
  success: boolean;
  type: string;
  data: AdminPatrolRunDetails;
}

/* =====================================================
   📌 EDIT PATROL RUN
===================================================== */

export interface UpdatePatrolSite {
  siteId?: string;
  id?: string;

  name?: string;
  address?: string;

  latitude?: string | number;
  longitude?: string | number;

  description?: string;
  status?: string;
}

export interface UpdatePatrolSubSite {
  subSiteId?: string;
  id?: string;

  name?: string;
  description?: string;
  status?: string;

  unitPrice?: string | number;
  estimatedDuration?: string | number;

  latitude?: string | number;
  longitude?: string | number;
}

export interface UpdatePatrolCheckpoint {
  checkpointId?: string;
  id?: string;

  name?: string;

  latitude?: string | number;
  longitude?: string | number;

  verificationRange?: string | number;

  priorityLevel?: PriorityLevel;

  description?: string;
  status?: string;
}

export interface AddPatrolSubSite {
  parentSiteId: string;
  subSiteId: string;
}

export interface AddPatrolCheckpoint {
  parentType: "site" | "subSite";
  parentId: string;
  checkpointId: string;
}

export interface EditPatrolRunRequest {
  startDateTime?: string;
  estimatedCompletion?: string;

  addSites?: string[];
  removeSiteIds?: string[];

  addSubSites?: AddPatrolSubSite[];
  removeSubSiteIds?: string[];

  addCheckpoints?: AddPatrolCheckpoint[];
  removeCheckpointIds?: string[];

  updateSites?: UpdatePatrolSite[];
  updateSubSites?: UpdatePatrolSubSite[];
  updateCheckpoints?: UpdatePatrolCheckpoint[];

  guardIds?: string[];
}

export interface EditPatrolRunArgs {
  id: string;
  data: EditPatrolRunRequest;
}

export type EditPatrolRunResponse = ApiMessageResponse;

/* =====================================================
   📌 PAGINATED SUB-SITES
===================================================== */

export interface GetAllPatrolSubSitesParams {
  page?: number;
  limit?: number;
  siteId?: string;
}

export interface GetAllPatrolSubSitesResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: CreatedSubSite[];
}

/* =====================================================
   📌 PAGINATED CHECKPOINTS
===================================================== */

export interface GetAllPatrolCheckpointsParams {
  page?: number;
  limit?: number;
  siteId?: string;
  subSiteId?: string;
}

export interface GetAllPatrolCheckpointsResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: PatrolCheckpoint[];
}

/* =====================================================
   📌 DOWNLOAD TYPES
===================================================== */

export interface DownloadQRParams {
  url: string;
  name: string;
}

export interface DownloadSiteQRsPdfParams {
  siteId: string;
}
