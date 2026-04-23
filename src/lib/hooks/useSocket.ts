import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_BASE_URL;

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("register", { token });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return socketRef;
};