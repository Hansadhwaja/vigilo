// hooks/messages/useTypingIndicator.ts

import { useEffect, useRef, useState } from "react";

import { Guard } from "@/apis/guardsApi";

import {
    TypingEvent,
} from "@/types";

interface Props {
    socketRef: React.MutableRefObject<any>;

    activeConversationId: string;

    selectedGuard: Guard | null;
}

export const useTypingIndicator = ({
    socketRef,
    activeConversationId,
    selectedGuard,
}: Props) => {
    const [isOtherTyping, setIsOtherTyping] =
        useState(false);

    const shouldEmitTypingRef =
        useRef(true);

    const typingTimeoutRef =
        useRef<number | null>(null);

    const selectedGuardRef =
        useRef<Guard | null>(null);

    useEffect(() => {
        selectedGuardRef.current =
            selectedGuard;
    }, [selectedGuard]);

    useEffect(() => {
        const socket = socketRef.current;

        if (!socket) return;

        const handleTyping = (
            payload: TypingEvent
        ) => {
            if (
                payload?.conversationId !==
                activeConversationId
            )
                return;

            const currentGuardId =
                selectedGuardRef.current?.id;

            if (
                currentGuardId &&
                String(payload.userId) !==
                    currentGuardId
            )
                return;

            setIsOtherTyping(true);
        };

        const handleStopTyping = (
            payload: TypingEvent
        ) => {
            if (
                payload?.conversationId !==
                activeConversationId
            )
                return;

            const currentGuardId =
                selectedGuardRef.current?.id;

            if (
                currentGuardId &&
                String(payload.userId) !==
                    currentGuardId
            )
                return;

            setIsOtherTyping(false);
        };

        socket.on(
            "userTyping",
            handleTyping
        );

        socket.on(
            "userStoppedTyping",
            handleStopTyping
        );

        return () => {
            socket.off(
                "userTyping",
                handleTyping
            );

            socket.off(
                "userStoppedTyping",
                handleStopTyping
            );
        };
    }, [
        activeConversationId,
        socketRef,
    ]);

    return {
        isOtherTyping,

        shouldEmitTypingRef,

        typingTimeoutRef,
    };
};