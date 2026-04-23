import { toast } from "sonner";
import { MessageItem, useDeleteMessageForEveryoneMutation, useDeleteMessageForMeMutation, useEditMessageMutation, useGetMessagesQuery } from "@/apis/messagesAPI";
import { useSocket } from "@/lib/hooks/useSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContactItem } from "@/types";
import EmptyMessage from "./EmptyMessage";
import MessageLoading from "./MessageLoading";
import MessageGroup from "./MessageGroup";

interface MessageListProps {
    activeConversationId: string;
    authUserId: string;
    refetchMessages: ReturnType<typeof useGetMessagesQuery>["refetch"];
    isMessagesFetching: boolean;
    messageList: MessageItem[];
    selectedContact: ContactItem | null;
}

const MessageList = ({
    activeConversationId,
    authUserId,
    isMessagesFetching,
    messageList,
    selectedContact,
    refetchMessages,

}: MessageListProps) => {
    const socketRef = useSocket();

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState("");

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [editMessage, { isLoading: isEditingMessage }] = useEditMessageMutation();
    const [deleteMessageForEveryone] = useDeleteMessageForEveryoneMutation();
    const [deleteMessageForMe] = useDeleteMessageForMeMutation();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);


    const groupedMessages = useMemo(() => {
        const groups: { label: string; messages: typeof messageList }[] = [];
        const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        const today = fmt(new Date()); const yesterday = fmt(new Date(Date.now() - 86400000));

        messageList.forEach((msg) => {
            const key = fmt(new Date(msg.createdAt));
            const label = key === today ? "Today" : key === yesterday ? "Yesterday" : key;
            const last = groups[groups.length - 1];
            if (last && last.label === label) last.messages.push(msg);
            else groups.push({ label, messages: [msg] });
        });

        return groups;
    }, [messageList]);

    const startEditMessage = (id: string, content: string | null) => {
        setEditingMessageId(id);
        setEditDraft(content || "");
    };

    const cancelEditMessage = () => {
        setEditingMessageId(null);
        setEditDraft("");
    };

    const handleSaveEditedMessage = async () => {
        if (!editingMessageId || !editDraft.trim()) {
            toast.error("Content required");
            return;
        }
        try {
            if (socketRef.current?.connected && activeConversationId) {
                socketRef.current.emit("x", {
                    messageId: editingMessageId,
                    conversationId: activeConversationId,
                    content: editDraft.trim(),
                });
                cancelEditMessage();
                return;
            }

            await editMessage({
                messageId: editingMessageId,
                content: editDraft.trim()
            }).unwrap();

            cancelEditMessage();
            await refetchMessages();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to edit");
        }
    };

    const handleDeleteForEveryone = async (messageId: string) => {
        if (!window.confirm("Delete for everyone?")) return;
        try {
            if (socketRef.current?.connected && activeConversationId) {
                socketRef.current.emit("deleteMessage", { messageId, conversationId: activeConversationId });
                if (editingMessageId === messageId) cancelEditMessage();
                return;
            }

            await deleteMessageForEveryone({ messageId }).unwrap();
            if (editingMessageId === messageId) cancelEditMessage();
            await refetchMessages();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete");
        }
    };

    const handleDeleteForMe = async (messageId: string) => {
        if (!window.confirm("Delete for you only?")) return;
        try {
            if (socketRef.current?.connected && activeConversationId) {
                socketRef.current.emit("deleteMessageForMe", { messageId, conversationId: activeConversationId });
                if (editingMessageId === messageId) cancelEditMessage();
                return;
            }

            await deleteMessageForMe({ messageId }).unwrap();
            if (editingMessageId === messageId) cancelEditMessage();
            await refetchMessages();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete");
        }
    };


    return (
        <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-1 flex"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0faf4 100%)`,
                backgroundSize: "60px 60px, 100% 100%",
            }}
        >
            {!activeConversationId || isMessagesFetching ? (
                <MessageLoading />
            ) : messageList.length === 0 ? (
                <EmptyMessage name={selectedContact?.name ?? "User"} />
            ) : (

                <div className="h-96 w-full">
                    {groupedMessages.map((group) => (
                        <MessageGroup
                            key={group.label}
                            group={group}
                            isEditingMessage={isEditingMessage}
                            authUserId={authUserId}
                            selectedContact={selectedContact}
                            editingMessageId={editingMessageId}
                            editDraft={editDraft}
                            setEditDraft={setEditDraft}
                            startEdit={(msg) => startEditMessage(msg.id, msg.content)}
                            cancelEdit={cancelEditMessage}
                            saveEdit={handleSaveEditedMessage}
                            onDeleteForEveryone={handleDeleteForEveryone}
                            onDeleteForMe={handleDeleteForMe}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>
            )}

        </div>
    );
};

export default MessageList;


