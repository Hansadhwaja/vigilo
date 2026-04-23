import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import {
    PresenceItem,
    useGetMessagesQuery,
    useMarkMessagesReadMutation,
} from "@/apis/messagesAPI";
import { ContactItem, PresenceUpdateEvent, SocketMessageEvent, TypingEvent } from "@/types";
import { io } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import { useSocket } from "@/lib/hooks/useSocket";
import ChatInput from "./ChatInput";
import MessageList from "./List/MessageList";

interface MessageChatSectionProps {
    activeConversationId: string;
    selectedContact: ContactItem | null;
    authUserId: string;
    emojiRef: RefObject<HTMLDivElement | null>;
    setEmojiOpen: Dispatch<SetStateAction<boolean>>;
    emojiOpen: boolean;
    isOpeningConversation: boolean;
    presenceMap: Map<string, PresenceItem>;
    setLivePresenceByUserId: Dispatch<SetStateAction<Record<string, PresenceUpdateEvent>>>
}

const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL ?? "";
const SOCKET_HEARTBEAT_MS = 30000;

const MessageChatSection = ({
    activeConversationId,
    selectedContact,
    authUserId,
    presenceMap,
    setLivePresenceByUserId,
    isOpeningConversation,
}: MessageChatSectionProps) => {
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    const shouldEmitTypingRef = useRef(true);
    const typingTimeoutRef = useRef<number | null>(null);
    const refetchMessagesRef = useRef<() => unknown>(() => undefined);
    const lastMarkedRef = useRef<string>("");
    const activeConversationRef = useRef<string>("");
    const socketRef = useSocket();
    const selectedContactRef = useRef<ContactItem | null>(null);

    const [markMessagesRead] = useMarkMessagesReadMutation();
    const {
        data: messagesResponse,
        refetch: refetchMessages,
        isFetching: isMessagesFetching
    } = useGetMessagesQuery(
        { conversationId: activeConversationId, limit: 50 },
        {
            skip: !activeConversationId,
           // pollingInterval: 2500,
            refetchOnMountOrArgChange: true
        }
    );

    const messageList = messagesResponse?.messages || [];

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);

    useEffect(() => {
        refetchMessagesRef.current = refetchMessages;
    }, [refetchMessages]);

    useEffect(() => {
        if (!activeConversationId || messageList.length === 0) return;
        const lastMessage = messageList[messageList.length - 1];
        if (!lastMessage) return;
        const markKey = `${activeConversationId}:${lastMessage.id}`;
        if (markKey === lastMarkedRef.current) return;
        lastMarkedRef.current = markKey;
        if (socketRef.current?.connected) {
            socketRef.current.emit("markSeen", { messageId: lastMessage.id, conversationId: activeConversationId });
        }
        markMessagesRead({ conversationId: activeConversationId, messageId: lastMessage.id }).catch(() => { lastMarkedRef.current = ""; });
    }, [activeConversationId, markMessagesRead, messageList]);

    const selectedPresence = selectedContact ? presenceMap.get(selectedContact.id) : null;

    useEffect(() => {
        if (!activeConversationId || !socketConnected || !socketRef.current) return;
        setIsOtherTyping(false);
        shouldEmitTypingRef.current = true;
        socketRef.current.emit("joinConversation", activeConversationId);
    }, [activeConversationId, socketConnected]);

    useEffect(() => {
        activeConversationRef.current = activeConversationId;
    }, [activeConversationId]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !authUserId) return;

        const socket = io(SOCKET_BASE_URL, {
            transports: ["polling", "websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            timeout: 20000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setSocketConnected(true);
            socket.emit("register", { token });

            if (activeConversationRef.current) {
                socket.emit("joinConversation", activeConversationRef.current);
            }
        });

        socket.on("disconnect", () => {
            setSocketConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.warn("Socket connect_error:", error.message);
        });

        socket.on("newMessage", (payload: SocketMessageEvent) => {
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
            }
        });

        socket.on("receiveMessage", (payload: SocketMessageEvent) => {
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
                socket.emit("markSeen", { messageId: payload.id, conversationId: payload.conversationId });
            }
        });

        socket.on("messageUpdated", (payload: { conversationId: string }) => {
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
            }
        });

        socket.on("messageDeleted", (payload: { conversationId: string }) => {
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
            }
        });

        socket.on("messageDeletedForMe", (payload: { conversationId: string; userId: string }) => {
            if (String(payload?.userId) !== authUserId) return;
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
            }
        });

        socket.on("messageSeen", (payload: { conversationId: string }) => {
            if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
                refetchMessagesRef.current();
            }
        });

        socket.on("userTyping", (payload: TypingEvent) => {
            if (!payload?.conversationId || payload.conversationId !== activeConversationRef.current) return;
            const currentContactId = selectedContactRef.current?.id;
            if (currentContactId && String(payload.userId) !== currentContactId) return;
            setIsOtherTyping(true);
        });

        socket.on("userStoppedTyping", (payload: TypingEvent) => {
            if (!payload?.conversationId || payload.conversationId !== activeConversationRef.current) return;
            const currentContactId = selectedContactRef.current?.id;
            if (currentContactId && String(payload.userId) !== currentContactId) return;
            setIsOtherTyping(false);
        });

        socket.on("presence:update", (payload: PresenceUpdateEvent) => {
            if (!payload?.userId) return;
            setLivePresenceByUserId((prev) => ({
                ...prev,
                [String(payload.userId)]: {
                    userId: String(payload.userId),
                    isOnline: !!payload.isOnline,
                    lastSeenAt: payload.lastSeenAt,
                },
            }));
        });

        const heartbeatTimer = window.setInterval(() => {
            if (socket.connected) {
                socket.emit("presence:heartbeat");
            }
        }, SOCKET_HEARTBEAT_MS);

        return () => {
            window.clearInterval(heartbeatTimer);
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
            setSocketConnected(false);
        };
    }, [authUserId]);


    return (
        <div className="flex-1 flex flex-col min-h-0">

            <ChatHeader
                selectedContact={selectedContact}
                isOtherTyping={isOtherTyping}
                selectedPresence={selectedPresence}
            />

            <MessageList
                activeConversationId={activeConversationId}
                authUserId={authUserId}
                isMessagesFetching={isMessagesFetching}
                messageList={messageList}
                selectedContact={selectedContact}
                refetchMessages={refetchMessages}
            />

            <ChatInput
                activeConversationId={activeConversationId}
                activeConversationRef={activeConversationRef}
                shouldEmitTypingRef={shouldEmitTypingRef}
                typingTimeoutRef={typingTimeoutRef}
                isOpeningConversation={isOpeningConversation}
                refetchMessages={refetchMessages}
            />
        </div>
    )
}

export default MessageChatSection

