import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";

const SOCKET_URL = import.meta.env.VITE_SOCKET_BASE_URL ?? "";

const SOCKET_HEARTBEAT_MS = 30000;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] ✅ Connected:", socket.id);

      setSocketConnected(true);

      socket.emit("register", {
        token,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] 🔴 Disconnected:", reason);

      setSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] ❌ Connection error:", error);
    });

    const heartbeatTimer = window.setInterval(() => {
      if (socket.connected) {
        socket.emit("presence:heartbeat");
      }
    }, SOCKET_HEARTBEAT_MS);

    return () => {
      window.clearInterval(heartbeatTimer);

      socket.removeAllListeners();
      socket.disconnect();

      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [token]);

  return {
    socketRef,
    socketConnected,
  };
};
