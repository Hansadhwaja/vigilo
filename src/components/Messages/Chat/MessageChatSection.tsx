import { Dispatch, SetStateAction } from "react";
import { PresenceItem } from "@/apis/messagesAPI";
import { PresenceUpdateEvent } from "@/types";
import { Guard } from "@/apis/guardsApi";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./List/MessageList";
import { useConversationMessages } from "./hooks/useConversationMessages";
import { useConversationSocket } from "./hooks/useConversationSocket";
import { useTypingIndicator } from "./hooks/useTypingIndicator";
import { useMessageSeen } from "./hooks/useMessageSeen";
import { usePresenceSync } from "./hooks/usePresenceSync";

interface MessageChatSectionProps {
    activeConversationId: string;

    selectedGuard: Guard | null;

    authUserId: string;

    isOpeningConversation: boolean;

    presenceMap: Map<string, PresenceItem>;

    setLivePresenceByUserId:
    Dispatch<
        SetStateAction<
            Record<
                string,
                PresenceUpdateEvent
            >
        >
    >;
}

const MessageChatSection = ({
    activeConversationId,
    selectedGuard,
    authUserId,
    presenceMap,
    setLivePresenceByUserId,
    isOpeningConversation,
}: MessageChatSectionProps) => {
    // messages
    const {
        messageList,
        refetchMessages,
        isMessagesFetching,
    } = useConversationMessages(
        activeConversationId
    );

    // socket
    const {
        socketRef,
        activeConversationRef,
    } = useConversationSocket({
        authUserId,
        activeConversationId,
        refetchMessages,
    });

    // typing
    const {
        isOtherTyping,
        shouldEmitTypingRef,
        typingTimeoutRef,
    } = useTypingIndicator({
        socketRef,
        activeConversationId,
        selectedGuard,
    });

    // seen
    useMessageSeen({
        socketRef,
        activeConversationId,
        messageList,
    });

    // presence sync
    usePresenceSync({
        socketRef,
        setLivePresenceByUserId,
    });

    // selected user presence
    const selectedPresence =
        selectedGuard
            ? presenceMap.get(
                selectedGuard.id
            )
            : null;

    return (
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <ChatHeader
                selectedGuard={
                    selectedGuard
                }
                isOtherTyping={
                    isOtherTyping
                }
                selectedPresence={
                    selectedPresence
                }
            />

            <MessageList
                activeConversationId={
                    activeConversationId
                }
                authUserId={
                    authUserId
                }
                isMessagesFetching={
                    isMessagesFetching
                }
                messageList={
                    messageList
                }
                selectedGuard={
                    selectedGuard
                }
                refetchMessages={
                    refetchMessages
                }
            />

            <ChatInput
                activeConversationId={
                    activeConversationId
                }
                activeConversationRef={
                    activeConversationRef
                }
                shouldEmitTypingRef={
                    shouldEmitTypingRef
                }
                typingTimeoutRef={
                    typingTimeoutRef
                }
                isOpeningConversation={
                    isOpeningConversation
                }
                refetchMessages={
                    refetchMessages
                }
            />
        </div>
    );
};

export default MessageChatSection;