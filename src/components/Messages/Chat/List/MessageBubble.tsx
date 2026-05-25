import { cn, formatMessageTime } from "@/lib/utils";
import MessageMenu from "../../MessageMenu";
import { Check, CheckCheck } from "lucide-react";
import { MessageItem } from "@/apis/messagesAPI";
import { Guard } from "@/apis/guardsApi";

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
    selectedGuard: Guard | null;
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
    selectedGuard
}: Props) => {

    const isEditing = editingMessageId === msg.id;
    const isBroadcast = msg.conversationId === null;
    const isDeleted = msg.isDeletedForEveryone;

    const isNormalMessage = !isBroadcast;

    const showMenu =
        isNormalMessage &&
        !isDeleted &&
        !isEditing;

    const renderStatus = (status?: string) => {
        const normalized = (status || "sent").toLowerCase();

        if (normalized === "seen" || normalized === "read") {
            return (
                <CheckCheck
                    size={13}
                    className="text-blue-500"
                />
            );
        }

        if (normalized === "delivered") {
            return <CheckCheck size={13} />;
        }

        return <Check size={13} />;
    };

    const bubbleClass = cn(
        "relative px-4 py-2.5 rounded-2xl",
        "min-w-[120px] max-w-[420px]",
        "shadow-sm backdrop-blur-[2px]",
        "transition-all duration-200",

        isBroadcast
            ? `
            bg-gradient-to-br 
            from-violet-100 
            via-fuchsia-50 
            to-purple-100
            border border-violet-200/60
            shadow-[0_4px_14px_rgba(139,92,246,0.10)]
          `
            : isMine
                ? `
                bg-gradient-to-br
                from-[#dcfce7]
                to-[#bbf7d0]
                rounded-br-md
                border border-green-200/60
                shadow-[0_2px_8px_rgba(34,197,94,0.10)]
              `
                : `
                bg-white/95
                rounded-bl-md
                border border-gray-200/70
                shadow-[0_2px_10px_rgba(0,0,0,0.04)]
              `
    );

    return (
        <div
            className={cn(
                "relative group/msg flex",
                isMine ? "justify-end" : "justify-start"
            )}
        >
            {/* Menu */}
            {showMenu && (
                <div
                    className={cn(
                        "absolute top-2 z-10 opacity-0 transition-all duration-200 group-hover/msg:opacity-100",
                        isMine
                            ? "-left-8"
                            : "-right-8"
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

            {/* Bubble */}
            <div className={bubbleClass}>

                {/* Broadcast Label */}
                {isBroadcast && (
                    <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200">
                        <span>📢</span>
                        <span>Broadcast</span>
                    </div>
                )}

                {/* Reply */}
                {msg.replyTo && (
                    <div
                        className={cn(
                            "mb-2 rounded-xl border-l-[3px] px-3 py-2 text-[11.5px]",
                            isMine
                                ? "border-emerald-500 bg-[#c8efc2]"
                                : "border-gray-300 bg-gray-50"
                        )}
                    >
                        <p className="mb-0.5 font-semibold text-emerald-700">
                            {String(msg.replyTo.senderId) === authUserId
                                ? "You"
                                : selectedGuard?.name}
                        </p>

                        <p className="truncate text-gray-500">
                            {msg.replyTo.isDeletedForEveryone
                                ? "This message was deleted"
                                : msg.replyTo.content}
                        </p>
                    </div>
                )}

                {/* Editing */}
                {isEditing ? (
                    <div className="space-y-2 min-w-[250px]">
                        <input
                            value={editDraft}
                            onChange={(e) =>
                                setEditDraft(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    saveEdit();

                                if (e.key === "Escape")
                                    cancelEdit();
                            }}
                            autoFocus
                            className="h-10 w-full rounded-xl border border-emerald-200 bg-white px-3 text-[13px] outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelEdit}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveEdit}
                                disabled={
                                    isEditingMessage ||
                                    !editDraft.trim()
                                }
                                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
                            >
                                {isEditingMessage
                                    ? "Saving…"
                                    : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Content */}
                        <p className="break-words whitespace-pre-wrap text-[13.5px] leading-relaxed text-gray-900">
                            {isDeleted ? (
                                <span className="italic text-gray-400">
                                    🚫 This message was deleted
                                </span>
                            ) : (
                                msg.content || "(No text)"
                            )}
                        </p>
                    </>
                )}

                {/* Footer */}
                <div className="mt-1.5 flex items-center justify-end gap-1">
                    {msg.isEdited && !isDeleted && (
                        <span className="text-[10px] italic text-gray-400">
                            edited
                        </span>
                    )}

                    <span className="text-[10.5px] text-gray-400">
                        {formatMessageTime(msg.createdAt)}
                    </span>

                    {isMine && (
                        <span className="ml-0.5 text-gray-400">
                            {renderStatus(msg.status)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;