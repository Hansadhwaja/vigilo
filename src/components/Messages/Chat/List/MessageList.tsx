import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";

import {
    MessageItem,
    useDeleteMessageForEveryoneMutation,
    useDeleteMessageForMeMutation,
    useEditMessageMutation,
    useGetMessagesQuery,
} from "@/apis/messagesAPI";

import { Guard } from "@/apis/guardsApi";

import { useSocket } from "@/lib/hooks/useSocket";

import EmptyMessage from "./EmptyMessage";
import MessageLoading from "./MessageLoading";
import MessageGroup from "./MessageGroup";

interface MessageListProps {
    activeConversationId: string;

    authUserId: string;

    refetchMessages:
    ReturnType<
        typeof useGetMessagesQuery
    >["refetch"];

    isMessagesFetching: boolean;

    messageList: MessageItem[];

    selectedGuard: Guard | null;
}

const MessageList = ({
    activeConversationId,
    authUserId,
    isMessagesFetching,
    messageList,
    selectedGuard,
    refetchMessages,
}: MessageListProps) => {
    const socketRef = useSocket();

    const bottomRef =
        useRef<HTMLDivElement | null>(
            null
        );

    // edit state
    const [
        editingMessageId,
        setEditingMessageId,
    ] = useState<string | null>(
        null
    );

    const [editDraft, setEditDraft] =
        useState("");

    // mutations
    const [
        editMessage,
        {
            isLoading:
            isEditingMessage,
        },
    ] = useEditMessageMutation();

    const [
        deleteMessageForEveryone,
    ] =
        useDeleteMessageForEveryoneMutation();

    const [deleteMessageForMe] =
        useDeleteMessageForMeMutation();

    // auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [messageList]);

    // group messages by date
    const groupedMessages = useMemo(() => {
        const groups: {
            label: string;

            messages: typeof messageList;
        }[] = [];

        const formatDate = (
            date: Date
        ) =>
            date.toLocaleDateString(
                "en-US",
                {
                    weekday:
                        "long",

                    year: "numeric",

                    month: "long",

                    day: "numeric",
                }
            );

        const today =
            formatDate(
                new Date()
            );

        const yesterday =
            formatDate(
                new Date(
                    Date.now() -
                    86400000
                )
            );

        messageList.forEach(
            (message) => {
                const dateKey =
                    formatDate(
                        new Date(
                            message.createdAt
                        )
                    );

                const label =
                    dateKey ===
                        today
                        ? "Today"
                        : dateKey ===
                            yesterday
                            ? "Yesterday"
                            : dateKey;

                const lastGroup =
                    groups[
                    groups.length -
                    1
                    ];

                if (
                    lastGroup &&
                    lastGroup.label ===
                    label
                ) {
                    lastGroup.messages.push(
                        message
                    );
                } else {
                    groups.push({
                        label,

                        messages: [
                            message,
                        ],
                    });
                }
            }
        );

        return groups;
    }, [messageList]);

    // edit handlers
    const startEditMessage = (
        id: string,
        content:
            | string
            | null
    ) => {
        setEditingMessageId(id);

        setEditDraft(content || "");
    };

    const cancelEditMessage = () => {
        setEditingMessageId(null);

        setEditDraft("");
    };

    const handleSaveEditedMessage = async () => {
        if (
            !editingMessageId ||
            !editDraft.trim()
        ) {
            toast.error(
                "Message content required"
            );

            return;
        }

        try {
            // socket
            if (
                socketRef.current
                    ?.connected &&
                activeConversationId
            ) {
                socketRef.current.emit(
                    "editMessage",
                    {
                        messageId:
                            editingMessageId,

                        conversationId:
                            activeConversationId,

                        content:
                            editDraft.trim(),
                    }
                );

                cancelEditMessage();

                return;
            }

            // api fallback
            await editMessage({
                messageId:
                    editingMessageId,

                content:
                    editDraft.trim(),
            }).unwrap();

            cancelEditMessage();

            await refetchMessages();
        } catch (error: any) {
            toast.error(
                error?.data
                    ?.message ||
                "Failed to edit message"
            );
        }
    };

    // delete everyone
    const handleDeleteForEveryone = async (
        messageId: string
    ) => {
        const confirmed =
            window.confirm(
                "Delete message for everyone?"
            );

        if (!confirmed)
            return;

        try {
            if (
                socketRef.current
                    ?.connected &&
                activeConversationId
            ) {
                socketRef.current.emit(
                    "deleteMessage",
                    {
                        messageId,

                        conversationId:
                            activeConversationId,
                    }
                );

                if (
                    editingMessageId ===
                    messageId
                ) {
                    cancelEditMessage();
                }

                return;
            }

            await deleteMessageForEveryone(
                {
                    messageId,
                }
            ).unwrap();

            if (
                editingMessageId ===
                messageId
            ) {
                cancelEditMessage();
            }

            await refetchMessages();
        } catch (error: any) {
            toast.error(
                error?.data
                    ?.message ||
                "Failed to delete message"
            );
        }
    };

    // delete me
    const handleDeleteForMe = async (
        messageId: string
    ) => {
        const confirmed =
            window.confirm(
                "Delete message for you only?"
            );

        if (!confirmed)
            return;

        try {
            if (
                socketRef.current
                    ?.connected &&
                activeConversationId
            ) {
                socketRef.current.emit(
                    "deleteMessageForMe",
                    {
                        messageId,

                        conversationId:
                            activeConversationId,
                    }
                );

                if (
                    editingMessageId ===
                    messageId
                ) {
                    cancelEditMessage();
                }

                return;
            }

            await deleteMessageForMe(
                {
                    messageId,
                }
            ).unwrap();

            if (
                editingMessageId ===
                messageId
            ) {
                cancelEditMessage();
            }

            await refetchMessages();
        } catch (error: any) {
            toast.error(
                error?.data
                    ?.message ||
                "Failed to delete message"
            );
        }
    };

    return (
        <div
            className="
                relative
                flex-1
                overflow-y-auto
                px-5
                py-6
                no-scrollbar
            "
            style={{
                background: `
        radial-gradient(circle at top right, rgba(168,85,247,0.08), transparent 25%),
        radial-gradient(circle at bottom left, rgba(16,185,129,0.08), transparent 25%),
        linear-gradient(
            135deg,
            #f8fafc 0%,
            #f0fdf4 35%,
            #fdfdfd 100%
        )
    `
            }}
        >
            {/* overlay pattern */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.03]
                "
                style={{
                    backgroundImage:
                        "radial-gradient(#10b981 1px, transparent 1px)",

                    backgroundSize:
                        "22px 22px",
                }}
            />

            {!activeConversationId ||
                isMessagesFetching ? (
                <MessageLoading />
            ) : messageList.length ===
                0 ? (
                <EmptyMessage
                    name={
                        selectedGuard?.name ??
                        "User"
                    }
                />
            ) : (
                <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6">
                    {groupedMessages.map(
                        (group) => (
                            <MessageGroup
                                key={
                                    group.label
                                }
                                group={
                                    group
                                }
                                isEditingMessage={
                                    isEditingMessage
                                }
                                authUserId={
                                    authUserId
                                }
                                selectedGuard={
                                    selectedGuard
                                }
                                editingMessageId={
                                    editingMessageId
                                }
                                editDraft={
                                    editDraft
                                }
                                setEditDraft={
                                    setEditDraft
                                }
                                startEdit={(
                                    message
                                ) =>
                                    startEditMessage(
                                        message.id,
                                        message.content
                                    )
                                }
                                cancelEdit={
                                    cancelEditMessage
                                }
                                saveEdit={
                                    handleSaveEditedMessage
                                }
                                onDeleteForEveryone={
                                    handleDeleteForEveryone
                                }
                                onDeleteForMe={
                                    handleDeleteForMe
                                }
                            />
                        )
                    )}

                    <div
                        ref={
                            bottomRef
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default MessageList;