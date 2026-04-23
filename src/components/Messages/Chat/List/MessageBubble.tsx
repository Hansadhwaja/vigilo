import { cn, formatMessageTime } from "@/lib/utils";
import MessageMenu from "../../MessageMenu";
import { Check, CheckCheck } from "lucide-react";
import { MessageItem } from "@/apis/messagesAPI";
import { ContactItem } from "@/types";

interface Props {
    msg: MessageItem;
    isMine: boolean;

    editingMessageId: string | null;
    editDraft: string;
    setEditDraft: (v: string) => void;

    startEdit: (msg: MessageItem) => void;
    cancelEdit: () => void;
    saveEdit: () => void;

    onDeleteForEveryone: (id: string) => void;
    onDeleteForMe: (id: string) => void;

    isEditingMessage: boolean;
    authUserId: string;
    selectedContact: ContactItem | null;
}

const MessageBubble = ({
    msg,
    isMine,
    editingMessageId,
    editDraft,
    setEditDraft,
    startEdit,
    cancelEdit,
    saveEdit,
    onDeleteForEveryone,
    onDeleteForMe,
    isEditingMessage,
    authUserId,
    selectedContact
}: Props) => {

    // ✅ Derived state (single source of truth)
    const isEditing = editingMessageId === msg.id;
    const isBroadcast = msg.conversationId === null;
    const isDeleted = msg.isDeletedForEveryone;

    const showMenu = !isDeleted && !isEditing && !isBroadcast;

    // ✅ Status renderer
    const renderStatus = (status?: string) => {
        const normalized = (status || "sent").toLowerCase();

        if (normalized === "seen" || normalized === "read") {
            return <CheckCheck size={13} className="text-blue-500" />;
        }

        if (normalized === "delivered") {
            return <CheckCheck size={13} />;
        }

        return <Check size={13} />;
    };

    // ✅ Bubble styles
    const bubbleClass = cn(
        "px-3.5 py-2 rounded-xl shadow-sm",
        isBroadcast
            ? "bg-purple-100 border border-purple-200"
            : isMine
                ? "bg-[#d9fdd3] rounded-tr-sm"
                : "bg-white rounded-tl-sm"
    );

    return (
        <div
            className={cn(
                "max-w-[72%] relative group/msg flex",
                isMine ? "justify-end" : "justify-start"
            )}
        >

            {/* ✅ Menu */}
            {showMenu && (
                <div
                    className={cn(
                        "absolute top-1 opacity-0 group-hover/msg:opacity-100 transition",
                        isMine ? "-left-6" : "-right-6"
                    )}
                >
                    <MessageMenu
                        isMine={isMine}
                        message={msg}
                        onEdit={startEdit}
                        onDeleteForEveryone={onDeleteForEveryone}
                        onDeleteForMe={onDeleteForMe}
                    />
                </div>
            )}

            {/* ✅ Bubble */}
            <div className={bubbleClass}>

                {/* Reply preview */}
                {msg.replyTo && (
                    <div
                        className={cn(
                            "mb-2 px-2.5 py-1.5 rounded-lg border-l-[3px] text-[11.5px]",
                            isMine
                                ? "bg-[#c6f2c0] border-emerald-500"
                                : "bg-gray-50 border-gray-300"
                        )}
                    >
                        <p className="font-semibold text-emerald-700 mb-0.5">
                            {String(msg.replyTo.senderId) === authUserId
                                ? "You"
                                : selectedContact?.name}
                        </p>
                        <p className="text-gray-500 truncate">
                            {msg.replyTo.isDeletedForEveryone
                                ? "This message was deleted"
                                : msg.replyTo.content}
                        </p>
                    </div>
                )}

                {/* Editing state */}
                {isEditing ? (
                    <div className="space-y-2 min-w-50">
                        <input
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                            className="w-full h-9 px-3 text-[13px] bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                        />

                        <div className="flex justify-end gap-1.5">
                            <button
                                onClick={cancelEdit}
                                className="px-2.5 py-1 text-[11px] bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                disabled={isEditingMessage || !editDraft.trim()}
                                className="px-2.5 py-1 text-[11px] bg-emerald-500 text-white rounded-md disabled:opacity-60"
                            >
                                {isEditingMessage ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Broadcast label */}
                        {isBroadcast && (
                            <div className="mb-1 text-[10px] font-medium text-purple-600">
                                📢 Broadcast
                            </div>
                        )}

                        {/* Message content */}
                        <p className="text-[13.5px] text-gray-900 whitespace-pre-wrap wrap-break-word">
                            {isDeleted
                                ? <span className="italic text-gray-400">🚫 This message was deleted</span>
                                : msg.content || "(No text)"}
                        </p>
                    </>
                )}

                {/* Footer */}
                <div className="flex items-center gap-1 mt-0.5 justify-end">
                    {msg.isEdited && !isDeleted && (
                        <span className="text-[10px] text-gray-400 italic">edited</span>
                    )}

                    <span className="text-[10.5px] text-gray-400">
                        {formatMessageTime(msg.createdAt)}
                    </span>

                    {isMine && (
                        <span className="text-gray-400">
                            {renderStatus(msg.status)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;