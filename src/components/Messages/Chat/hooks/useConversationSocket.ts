// hooks/messages/useConversationSocket.ts

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_BASE_URL =
    import.meta.env.VITE_SOCKET_BASE_URL ?? "";

const SOCKET_HEARTBEAT_MS = 30000;

interface Props {
    authUserId: string;

    activeConversationId: string;

    refetchMessages: () => unknown;
}

export const useConversationSocket = ({
    authUserId,
    activeConversationId,
    refetchMessages,
}: Props) => {
    const socketRef = useRef<Socket | null>(null);

    const activeConversationRef =
        useRef(activeConversationId);

    const [socketConnected, setSocketConnected] =
        useState(false);

    useEffect(() => {
        activeConversationRef.current =
            activeConversationId;
    }, [activeConversationId]);

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token || !authUserId) return;

        const socket = io(
            SOCKET_BASE_URL,
            {
                transports: [
                    "polling",
                    "websocket",
                ],
                reconnection: true,
                reconnectionAttempts:
                    Infinity,
                reconnectionDelay: 1000,
                timeout: 20000,
            }
        );

        socketRef.current = socket;

        socket.on("connect", () => {
            setSocketConnected(true);

            socket.emit("register", {
                token,
            });

            if (
                activeConversationRef.current
            ) {
                socket.emit(
                    "joinConversation",
                    activeConversationRef.current
                );
            }
        });

        socket.on("disconnect", () => {
            setSocketConnected(false);
        });

        socket.on("newMessage", (payload) => {
            if (
                payload?.conversationId ===
                activeConversationRef.current
            ) {
                refetchMessages();
            }
        });

        socket.on(
            "receiveMessage",
            (payload) => {
                if (
                    payload?.conversationId ===
                    activeConversationRef.current
                ) {
                    refetchMessages();

                    socket.emit(
                        "markSeen",
                        {
                            messageId:
                                payload.id,
                            conversationId:
                                payload.conversationId,
                        }
                    );
                }
            }
        );

        socket.on(
            "messageUpdated",
            (payload) => {
                if (
                    payload?.conversationId ===
                    activeConversationRef.current
                ) {
                    refetchMessages();
                }
            }
        );

        socket.on(
            "messageDeleted",
            (payload) => {
                if (
                    payload?.conversationId ===
                    activeConversationRef.current
                ) {
                    refetchMessages();
                }
            }
        );

        socket.on(
            "messageSeen",
            (payload) => {
                if (
                    payload?.conversationId ===
                    activeConversationRef.current
                ) {
                    refetchMessages();
                }
            }
        );

        const heartbeatTimer =
            window.setInterval(() => {
                if (socket.connected) {
                    socket.emit(
                        "presence:heartbeat"
                    );
                }
            }, SOCKET_HEARTBEAT_MS);

        return () => {
            window.clearInterval(
                heartbeatTimer
            );

            socket.removeAllListeners();

            socket.disconnect();

            socketRef.current = null;

            setSocketConnected(false);
        };
    }, [authUserId, refetchMessages]);

    useEffect(() => {
        if (
            !activeConversationId ||
            !socketConnected ||
            !socketRef.current
        )
            return;

        socketRef.current.emit(
            "joinConversation",
            activeConversationId
        );
    }, [
        activeConversationId,
        socketConnected,
    ]);

    return {
        socketRef,

        socketConnected,

        activeConversationRef,
    };
};