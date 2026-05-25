// hooks/messages/useMessageSeen.ts

import { useEffect, useRef } from "react";

import {
    useMarkMessagesReadMutation,
} from "@/apis/messagesAPI";

interface Props {
    socketRef: React.MutableRefObject<any>;

    activeConversationId: string;

    messageList: any[];
}

export const useMessageSeen = ({
    socketRef,
    activeConversationId,
    messageList,
}: Props) => {
    const [markMessagesRead] =
        useMarkMessagesReadMutation();

    const lastMarkedRef =
        useRef("");

    useEffect(() => {
        if (
            !activeConversationId ||
            messageList.length === 0
        )
            return;

        const lastMessage =
            messageList[
                messageList.length - 1
            ];

        if (!lastMessage) return;

        const markKey = `${activeConversationId}:${lastMessage.id}`;

        if (
            markKey ===
            lastMarkedRef.current
        )
            return;

        lastMarkedRef.current =
            markKey;

        if (socketRef.current?.connected) {
            socketRef.current.emit(
                "markSeen",
                {
                    messageId:
                        lastMessage.id,
                    conversationId:
                        activeConversationId,
                }
            );
        }

        markMessagesRead({
            conversationId:
                activeConversationId,

            messageId: lastMessage.id,
        }).catch(() => {
            lastMarkedRef.current = "";
        });
    }, [
        activeConversationId,
        markMessagesRead,
        messageList,
        socketRef,
    ]);
};