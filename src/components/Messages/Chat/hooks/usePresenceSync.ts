// hooks/messages/usePresenceSync.ts

import { useEffect } from "react";

import {
    PresenceUpdateEvent,
} from "@/types";

interface Props {
    socketRef: React.MutableRefObject<any>;

    setLivePresenceByUserId:
        React.Dispatch<
            React.SetStateAction<
                Record<
                    string,
                    PresenceUpdateEvent
                >
            >
        >;
}

export const usePresenceSync = ({
    socketRef,
    setLivePresenceByUserId,
}: Props) => {
    useEffect(() => {
        const socket = socketRef.current;

        if (!socket) return;

        const handlePresenceUpdate = (
            payload: PresenceUpdateEvent
        ) => {
            if (!payload?.userId) return;

            setLivePresenceByUserId(
                (prev) => ({
                    ...prev,

                    [String(payload.userId)]:
                    {
                        userId: String(
                            payload.userId
                        ),

                        isOnline:
                            !!payload.isOnline,

                        lastSeenAt:
                            payload.lastSeenAt,
                    },
                })
            );
        };

        socket.on(
            "presence:update",
            handlePresenceUpdate
        );

        return () => {
            socket.off(
                "presence:update",
                handlePresenceUpdate
            );
        };
    }, [
        socketRef,
        setLivePresenceByUserId,
    ]);
};