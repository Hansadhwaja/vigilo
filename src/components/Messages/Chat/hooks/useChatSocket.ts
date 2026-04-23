import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useChatSocket = ({
    authUserId,
    activeConversationId,
    onMessage,
    onTyping,
    onStopTyping,
    onPresence
}) => {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const socketBaseurl = import.meta.env.VITE_SOCKET_BASE_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = io(socketBaseurl);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            socket.emit("register", { token });
        });

        socket.on("newMessage", onMessage);
        socket.on("receiveMessage", onMessage);
        socket.on("userTyping", onTyping);
        socket.on("userStoppedTyping", onStopTyping);
        socket.on("presence:update", onPresence);

        return () => {
            socket.disconnect();
        };
    }, []);

    return { socketRef, connected };
};