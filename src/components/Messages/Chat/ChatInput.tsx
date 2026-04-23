import { useGetMessagesQuery, useSendMessageMutation } from "@/apis/messagesAPI";
import { EMOJI_SET } from "@/constants";
import { useSocket } from "@/lib/hooks/useSocket";
import { fileToDataUrl } from "@/lib/utils";
import { PendingAttachment } from "@/types";
import { Paperclip, Send, Smile } from "lucide-react";
import { RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import AttachmentPreview from "./AttachmentPreview";

interface ChatInputProps {
    activeConversationId: string;
    activeConversationRef: RefObject<string>;
    shouldEmitTypingRef: RefObject<boolean>;
    typingTimeoutRef: RefObject<number | null>;
    isOpeningConversation: boolean;
    refetchMessages: ReturnType<typeof useGetMessagesQuery>["refetch"];
}

const ChatInput = ({
    activeConversationId,
    activeConversationRef,
    shouldEmitTypingRef,
    typingTimeoutRef,
    isOpeningConversation,
    refetchMessages,
}: ChatInputProps) => {
    const socketRef = useSocket();

    const [draftMessage, setDraftMessage] = useState("");
    const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);


    const fileInputRef = useRef<HTMLInputElement>(null);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    const handleSendMessage = async () => {
        if (!activeConversationId) return;
        const trimmed = draftMessage.trim();
        if (!trimmed && pendingAttachments.length === 0) return;
        const attachmentsPayload = pendingAttachments.map((f) => ({ name: f.name, type: f.type, size: f.size, content: f.dataUrl }));

        try {
            if (socketRef.current?.connected) {
                socketRef.current.emit("sendMessage", {
                    conversationId: activeConversationId,
                    message: trimmed,
                    type: attachmentsPayload.length ? "file" : "text",
                    attachments: attachmentsPayload,
                });
                setDraftMessage("");
                setPendingAttachments([]);
                // setEmojiOpen(false);
                shouldEmitTypingRef.current = true;
                socketRef.current.emit("stopTyping", { conversationId: activeConversationId });
                return;
            }

            console.log("Emitting sendMessage via API for conversationId", activeConversationId, "with content:", trimmed, "and attachments:", attachmentsPayload);

            await sendMessage({
                conversationId: activeConversationId,
                content: trimmed || undefined,
                type: attachmentsPayload.length ? "file" : "text",
                attachments: attachmentsPayload
            }).unwrap();

            console.log("Message sent successfully via API");

            setDraftMessage("");
            setPendingAttachments([]);
            // setEmojiOpen(false);
            await refetchMessages();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send message");
        }
    };

    const handleTyping = (value: string) => {
        if (!activeConversationId || !socketRef.current?.connected) return;

        if (value.trim()) {
            // Emit typing only once
            if (shouldEmitTypingRef.current) {
                socketRef.current.emit("typing", {
                    conversationId: activeConversationId,
                });
                shouldEmitTypingRef.current = false;
            }

            // Reset timeout
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = window.setTimeout(() => {
                if (socketRef.current?.connected && activeConversationRef.current) {
                    socketRef.current.emit("stopTyping", {
                        conversationId: activeConversationRef.current,
                    });
                }

                shouldEmitTypingRef.current = true;
                typingTimeoutRef.current = null;
            }, 1500);
        } else {
            // If input cleared → stop typing immediately
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }

            socketRef.current.emit("stopTyping", {
                conversationId: activeConversationId,
            });

            shouldEmitTypingRef.current = true;
        }
    };

    const handlePickFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        if (files.length + pendingAttachments.length > 5) {
            toast.error("Max 5 files"); event.target.value = "";
            return;
        }
        const tooLarge = files.find((f) => f.size > 5 * 1024 * 1024);
        if (tooLarge) {
            toast.error(`${tooLarge.name} > 5MB`);
            event.target.value = ""; return;
        }
        try {
            const mapped = await Promise.all(files.map(async (f) => ({
                id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
                name: f.name, type: f.type || "application/octet-stream",
                size: f.size,
                dataUrl: await fileToDataUrl(f)
            })));
            setPendingAttachments((prev) => [...prev, ...mapped]);
        } catch {
            toast.error("Some files could not be attached");
        }
        finally { event.target.value = ""; }
    };

    return (
        <footer className="p-4 border-t bg-background">
            <AttachmentPreview pendingAttachments={pendingAttachments} setPendingAttachments={setPendingAttachments} />
            <div className="flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    onChange={handlePickFiles}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex items-center gap-2">

                    <div className="relative flex-1">
                        <Input
                            value={draftMessage}
                            onChange={(e) => {
                                setDraftMessage(e.target.value);
                                handleTyping(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={!activeConversationId || isOpeningConversation}
                            placeholder="Type a message…"
                            className="pr-10"
                        />

                        {/* 😊 Emoji Picker */}
                        <div className="absolute right-1 top-1/2 -translate-y-1/2">
                            <Popover>
                                <PopoverTrigger className="cursor-pointer">
                                    <Smile className="h-4 w-4" />
                                </PopoverTrigger>

                                <PopoverContent className="w-64 p-2 mr-6">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Pick an emoji
                                    </p>
                                    <div className="grid grid-cols-5 gap-1">
                                        {EMOJI_SET.map((emoji) => (
                                            <Button
                                                key={emoji}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDraftMessage((p) => p + emoji)
                                                }
                                            >
                                                {emoji}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={
                        (!draftMessage.trim() && pendingAttachments.length === 0) ||
                        !activeConversationId ||
                        isSending
                    }
                >
                    {isSending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </footer>
    );
};

export default ChatInput;