import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
    PresenceItem,
    useCreateOrGetDirectConversationMutation,
    useGetBulkPresenceQuery,
    useHeartbeatPresenceMutation,
} from "@/apis/messagesAPI";

import { Guard, useGetAllGuardsQuery } from "@/apis/guardsApi";
import { PresenceUpdateEvent } from "@/types";

export const useMessageData = () => {
    const [activeConversationId, setActiveConversationId] = useState<string>("");
    const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
    const [openingUserId, setOpeningUserId] = useState<string>("");
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [conversationByUserId, setConversationByUserId] = useState<Record<string, string>>({});
    const [livePresenceByUserId, setLivePresenceByUserId] = useState<Record<string, PresenceUpdateEvent>>({});
    const emojiRef = useRef<HTMLDivElement | null>(null);

    const [heartbeatPresence] = useHeartbeatPresenceMutation();

    const { data: guardsResponse, isLoading: isGuardsLoading } =
        useGetAllGuardsQuery({
            page: 1,
            limit: 1000,
        });

    const guards = guardsResponse?.data ?? [];

    const authUser = useMemo(() => {
        try {
            const raw = localStorage.getItem("user");

            if (!raw) return null;

            return JSON.parse(raw);
        } catch {
            return null;
        }
    }, []);

    const authUserId = String(
        authUser?.id || authUser?._id || ""
    );

    const presenceIds = useMemo(
        () => guards.map((g) => g.id).filter(Boolean),
        [guards]
    );

    const [
        createOrGetConversation,
        { isLoading: isOpeningConversation },
    ] = useCreateOrGetDirectConversationMutation();

    const { data: presenceRows = [] } = useGetBulkPresenceQuery(presenceIds, {
        skip: presenceIds.length === 0,
        pollingInterval: 15000,
    });

    const presenceMap = useMemo(() => {
        const map = new Map(
            presenceRows.map((row: PresenceItem) => [
                String(row.userId),
                row,
            ])
        );

        Object.values(livePresenceByUserId).forEach((row) => {
            map.set(String(row.userId), row);
        });

        return map;
    }, [livePresenceByUserId, presenceRows]);

    const openGuardChat = async (guard: Guard) => {
        setSelectedGuard(guard);

        const targetUserId = guard.id;

        if (!targetUserId || !String(targetUserId).trim()) {
            toast.error("Missing user id");
            return;
        }

        if (String(targetUserId) === authUserId) {
            toast.error("Cannot create conversation with yourself");
            return;
        }

        const knownConversation =
            conversationByUserId[String(targetUserId)];

        if (knownConversation) {
            setActiveConversationId(knownConversation);
            return;
        }

        try {
            setOpeningUserId(String(targetUserId));

            const response = await createOrGetConversation({
                userId: String(targetUserId),
            }).unwrap();

            setConversationByUserId((prev) => ({
                ...prev,
                [String(targetUserId)]:
                    response.conversationId,
            }));

            setActiveConversationId(
                response.conversationId
            );
        } catch (error: any) {
            toast.error(
                error?.data?.message ||
                "Unable to open conversation"
            );
        } finally {
            setOpeningUserId("");
        }
    };

    useEffect(() => {
        const heartbeat = () =>
            heartbeatPresence().catch(() => undefined);

        heartbeat();

        const timer = window.setInterval(
            heartbeat,
            45000
        );

        return () => window.clearInterval(timer);
    }, [heartbeatPresence]);

    return {
        activeConversationId,
        selectedGuard,
        openingUserId,
        emojiOpen,
        emojiRef,
        guards,
        isGuardsLoading,
        conversationByUserId,
        presenceMap,
        authUserId,
        isOpeningConversation,

        setEmojiOpen,
        setLivePresenceByUserId,

        openGuardChat,
    };
};