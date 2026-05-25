// hooks/messages/useConversationMessages.ts

import { useGetMessagesQuery } from "@/apis/messagesAPI";

export const useConversationMessages = (
    activeConversationId: string
) => {
    const {
        data: messagesResponse,
        refetch,
        isFetching,
    } = useGetMessagesQuery(
        {
            conversationId: activeConversationId,
            limit: 50,
        },
        {
            skip: !activeConversationId,
            refetchOnMountOrArgChange: true,
        }
    );

    return {
        messageList:
            messagesResponse?.messages || [],

        refetchMessages: refetch,

        isMessagesFetching: isFetching,
    };
};