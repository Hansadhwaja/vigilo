import { baseApi } from "./baseApi";

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCounts {
  all: number;
  unread: number;
  newRequests: number;
}

export interface NotificationsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetMyNotificationsResponse {
  success: boolean;
  filter: string;
  counts: NotificationCounts;
  pagination: NotificationsPagination;
  data: NotificationItem[];
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;
  filter: string;
  updatedCount: number;
}

export interface DeleteAllNotificationsResponse {
  success: boolean;
  message: string;
  filter: string;
  deletedCount: number;
}

export interface DeleteNotificationByIdResponse {
  success: boolean;
  message: string;
  notificationId: string;
}

export type NotificationFilter = "all" | "unread" | "newRequests";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<GetMyNotificationsResponse, { page?: number; limit?: number; filter?: NotificationFilter } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;
        const filter = args?.filter ?? "all";

        return {
          url: `/notifications/getMyNotifications?page=${page}&limit=${limit}`,
          method: "GET",
          params: { filter },
        };
      },
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    markAllNotificationsAsRead: builder.mutation<MarkAllNotificationsReadResponse, { filter?: NotificationFilter } | void>({
      query: (body) => ({
        url: `/notifications/markAllNotificationsAsRead`,
        method: "PATCH",
        body: body || { filter: "all" },
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    deleteAllNotifications: builder.mutation<DeleteAllNotificationsResponse, { filter?: NotificationFilter } | void>({
      query: (body) => ({
        url: `/notifications/deleteAllNotifications`,
        method: "DELETE",
        body: body || { filter: "all" },
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    deleteNotificationById: builder.mutation<DeleteNotificationByIdResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/deleteNotificationById/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useDeleteAllNotificationsMutation,
  useDeleteNotificationByIdMutation,
} = notificationsApi;
