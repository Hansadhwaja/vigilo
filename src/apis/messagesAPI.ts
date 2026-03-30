import { baseApi } from "./baseApi";

export interface ChatListItem {
  conversationId: string;
  type: "direct" | "group";
  title: string;
  avatar?: string | null;
  isMuted?: boolean;
  isPinned?: boolean;
  lastMessage: {
    id: string;
    content: string | null;
    type: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export interface ReplyMessageSummary {
  id: string;
  content: string | null;
  senderId: string;
  type: string;
  createdAt: string;
  attachments: unknown[];
  isDeletedForEveryone: boolean;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: string;
  status: "sent" | "delivered" | "seen";
  attachments?: unknown[];
  replyToMessageId?: string | null;
  replyTo?: ReplyMessageSummary | null;
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeletedForEveryone?: boolean;
  deletedAt?: string | null;
}

export interface GetMessagesResponse {
  conversationId: string;
  messages: MessageItem[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface SendMessagePayload {
  conversationId: string;
  content?: string;
  type?: string;
  replyToMessageId?: string | null;
  attachments?: unknown[];
}

export interface SendMessageResponse {
  message: string;
  data: MessageItem;
}

export interface EditMessagePayload {
  messageId: string;
  content: string;
}

export interface EditMessageResponse {
  message: string;
  data: MessageItem;
}

export interface DeleteMessageResponse {
  message: string;
  data?: MessageItem;
}

export interface CreateDirectConversationPayload {
  userId: string;
}

export interface CreateDirectConversationResponse {
  conversationId: string;
  isNew: boolean;
  type?: "direct" | "group";
}

export interface PresenceItem {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string | null;
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatList: builder.query<ChatListItem[], void>({
      query: () => ({
        url: "/messages/conversations",
        method: "GET",
      }),
      providesTags: [{ type: "Messages", id: "CHAT_LIST" }],
    }),

    createOrGetDirectConversation: builder.mutation<
      CreateDirectConversationResponse,
      CreateDirectConversationPayload
    >({
      query: (body) => ({
        url: "/messages/conversations/direct",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Messages", id: "CHAT_LIST" }],
    }),

    getMessages: builder.query<
      GetMessagesResponse,
      { conversationId: string; cursor?: string; limit?: number }
    >({
      query: ({ conversationId, cursor, limit = 30 }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: "GET",
        params: {
          ...(cursor ? { cursor } : {}),
          limit,
        },
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: `CONVERSATION_${conversationId}` },
      ],
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: ({ conversationId, ...body }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: "CHAT_LIST" },
        { type: "Messages", id: `CONVERSATION_${conversationId}` },
      ],
    }),

    editMessage: builder.mutation<EditMessageResponse, EditMessagePayload>({
      query: ({ messageId, content }) => ({
        url: `/messages/messages/${messageId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: [{ type: "Messages", id: "CHAT_LIST" }],
    }),

    deleteMessageForEveryone: builder.mutation<DeleteMessageResponse, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Messages", id: "CHAT_LIST" }],
    }),

    deleteMessageForMe: builder.mutation<DeleteMessageResponse, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/messages/${messageId}/me`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Messages", id: "CHAT_LIST" }],
    }),

    markMessagesRead: builder.mutation<
      { message: string },
      { conversationId: string; messageId?: string }
    >({
      query: ({ conversationId, messageId }) => ({
        url: `/messages/conversations/${conversationId}/read`,
        method: "PATCH",
        body: {
          ...(messageId ? { messageId } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: "CHAT_LIST" },
        { type: "Messages", id: `CONVERSATION_${conversationId}` },
      ],
    }),

    getBulkPresence: builder.query<PresenceItem[], string[]>({
      query: (userIds) => ({
        url: "/messages/presence",
        method: "GET",
        params: {
          userIds: userIds.join(","),
        },
      }),
      providesTags: [{ type: "Presence", id: "LIST" }],
    }),

    heartbeatPresence: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/messages/presence/me/heartbeat",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Presence", id: "LIST" }],
    }),
  }),
});

export const {
  useGetChatListQuery,
  useCreateOrGetDirectConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageForEveryoneMutation,
  useDeleteMessageForMeMutation,
  useMarkMessagesReadMutation,
  useGetBulkPresenceQuery,
  useHeartbeatPresenceMutation,
} = messagesApi;
