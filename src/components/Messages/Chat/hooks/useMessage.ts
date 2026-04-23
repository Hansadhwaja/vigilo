import { useGetMessagesQuery } from "@/apis/messagesAPI";

export const useMessages = (conversationId: string) => {
    const {
        data,
        refetch,
        isFetching
    } = useGetMessagesQuery(
        { conversationId, limit: 50 },
        { skip: !conversationId, pollingInterval: 2500 }
    );

    return {
        messages: data?.messages || [],
        refetch,
        isFetching
    };
};