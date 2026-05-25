import {
    useGetMessagesQuery,
    useSendMessageMutation,
} from "@/apis/messagesAPI";

import { EMOJI_SET } from "@/constants";

import { useSocket } from "@/lib/hooks/useSocket";

import { fileToDataUrl } from "@/lib/utils";

import { PendingAttachment } from "@/types";

import {
    Paperclip,
    Send,
    Smile,
    Sparkles,
} from "lucide-react";

import {
    RefObject,
    useRef,
    useState,
} from "react";

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

    activeConversationRef:
    RefObject<string>;

    shouldEmitTypingRef:
    RefObject<boolean>;

    typingTimeoutRef:
    RefObject<number | null>;

    isOpeningConversation: boolean;

    refetchMessages:
    ReturnType<
        typeof useGetMessagesQuery
    >["refetch"];
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

    const [draftMessage, setDraftMessage] =
        useState("");

    const [
        pendingAttachments,
        setPendingAttachments,
    ] = useState<
        PendingAttachment[]
    >([]);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [
        sendMessage,
        { isLoading: isSending },
    ] = useSendMessageMutation();

    const handleSendMessage = async () => {
        if (
            !activeConversationId
        )
            return;

        const trimmed =
            draftMessage.trim();

        if (
            !trimmed &&
            pendingAttachments.length === 0
        )
            return;

        const attachmentsPayload =
            pendingAttachments.map(
                (file) => ({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    content:
                        file.dataUrl,
                })
            );

        try {
            // socket send
            if (
                socketRef.current
                    ?.connected
            ) {
                socketRef.current.emit(
                    "sendMessage",
                    {
                        conversationId:
                            activeConversationId,

                        message:
                            trimmed,

                        type: attachmentsPayload.length
                            ? "file"
                            : "text",

                        attachments:
                            attachmentsPayload,
                    }
                );

                setDraftMessage(
                    ""
                );

                setPendingAttachments(
                    []
                );

                shouldEmitTypingRef.current =
                    true;

                socketRef.current.emit(
                    "stopTyping",
                    {
                        conversationId:
                            activeConversationId,
                    }
                );

                return;
            }

            // api fallback
            await sendMessage({
                conversationId:
                    activeConversationId,

                content:
                    trimmed ||
                    undefined,

                type: attachmentsPayload.length
                    ? "file"
                    : "text",

                attachments:
                    attachmentsPayload,
            }).unwrap();

            setDraftMessage("");

            setPendingAttachments(
                []
            );

            await refetchMessages();
        } catch (error: any) {
            toast.error(
                error?.data
                    ?.message ||
                "Failed to send message"
            );
        }
    };

    const handleTyping = (
        value: string
    ) => {
        if (
            !activeConversationId ||
            !socketRef.current
                ?.connected
        )
            return;

        if (value.trim()) {
            if (
                shouldEmitTypingRef.current
            ) {
                socketRef.current.emit(
                    "typing",
                    {
                        conversationId:
                            activeConversationId,
                    }
                );

                shouldEmitTypingRef.current =
                    false;
            }

            if (
                typingTimeoutRef.current
            ) {
                window.clearTimeout(
                    typingTimeoutRef.current
                );
            }

            typingTimeoutRef.current =
                window.setTimeout(
                    () => {
                        if (
                            socketRef
                                .current
                                ?.connected &&
                            activeConversationRef.current
                        ) {
                            socketRef.current.emit(
                                "stopTyping",
                                {
                                    conversationId:
                                        activeConversationRef.current,
                                }
                            );
                        }

                        shouldEmitTypingRef.current =
                            true;

                        typingTimeoutRef.current =
                            null;
                    },
                    1500
                );
        } else {
            if (
                typingTimeoutRef.current
            ) {
                window.clearTimeout(
                    typingTimeoutRef.current
                );

                typingTimeoutRef.current =
                    null;
            }

            socketRef.current.emit(
                "stopTyping",
                {
                    conversationId:
                        activeConversationId,
                }
            );

            shouldEmitTypingRef.current =
                true;
        }
    };

    const handlePickFiles = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(
            event.target.files || []
        );

        if (!files.length)
            return;

        if (
            files.length +
            pendingAttachments.length >
            5
        ) {
            toast.error(
                "Maximum 5 files allowed"
            );

            event.target.value =
                "";

            return;
        }

        const tooLarge =
            files.find(
                (file) =>
                    file.size >
                    5 *
                    1024 *
                    1024
            );

        if (tooLarge) {
            toast.error(
                `${tooLarge.name} exceeds 5MB`
            );

            event.target.value =
                "";

            return;
        }

        try {
            const mapped =
                await Promise.all(
                    files.map(
                        async (
                            file
                        ) => ({
                            id: `${file.name}-${file.lastModified}-${Math.random()
                                .toString(
                                    36
                                )
                                .slice(
                                    2,
                                    8
                                )}`,

                            name: file.name,

                            type:
                                file.type ||
                                "application/octet-stream",

                            size: file.size,

                            dataUrl:
                                await fileToDataUrl(
                                    file
                                ),
                        })
                    )
                );

            setPendingAttachments(
                (prev) => [
                    ...prev,
                    ...mapped,
                ]
            );
        } catch {
            toast.error(
                "Some files could not be attached"
            );
        } finally {
            event.target.value =
                "";
        }
    };

    return (
        <footer className="shrink-0 border-t border-border/60 bg-background/90 backdrop-blur-xl">
            <div className="space-y-3 p-4">
                <AttachmentPreview
                    pendingAttachments={
                        pendingAttachments
                    }
                    setPendingAttachments={
                        setPendingAttachments
                    }
                />

                <div className="flex items-end gap-3">
                    {/* attachment */}
                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        hidden
                        multiple
                        onChange={
                            handlePickFiles
                        }
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="
                            h-11
                            w-11
                            rounded-2xl
                            border-border/60
                            shadow-sm
                            hover:bg-muted
                        "
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    {/* input */}
                    <div className="relative flex-1">
                        <div
                            className="
                                flex
                                items-center
                                rounded-3xl
                                border
                                border-border/60
                                bg-background
                                px-3
                                shadow-sm
                                transition-all
                                focus-within:ring-2
                                focus-within:ring-emerald-500/20
                            "
                        >
                            <Input
                                value={
                                    draftMessage
                                }
                                onChange={(
                                    e
                                ) => {
                                    setDraftMessage(
                                        e
                                            .target
                                            .value
                                    );

                                    handleTyping(
                                        e
                                            .target
                                            .value
                                    );
                                }}
                                onKeyDown={(
                                    e
                                ) => {
                                    if (
                                        e.key ===
                                        "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();

                                        handleSendMessage();
                                    }
                                }}
                                disabled={
                                    !activeConversationId ||
                                    isOpeningConversation
                                }
                                placeholder="Type your message..."
                                className="
                                    h-12
                                    border-0
                                    bg-transparent
                                    px-1
                                    shadow-none
                                    focus-visible:ring-0
                                "
                            />

                            {/* emoji */}
                            <Popover>
                                <PopoverTrigger
                                    asChild
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="
                                            h-9
                                            w-9
                                            rounded-xl
                                            text-muted-foreground
                                            hover:text-foreground
                                        "
                                    >
                                        <Smile className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="end"
                                    className="
                                        w-72
                                        rounded-2xl
                                        border-border/60
                                        p-3
                                        shadow-xl
                                    "
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Emoji
                                                Picker
                                            </p>

                                            <p className="text-[11px] text-muted-foreground">
                                                Add
                                                reactions
                                                quickly
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-6 gap-1">
                                        {EMOJI_SET.map(
                                            (
                                                emoji
                                            ) => (
                                                <button
                                                    key={
                                                        emoji
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setDraftMessage(
                                                            (
                                                                prev
                                                            ) =>
                                                                prev +
                                                                emoji
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        text-lg
                                                        transition-all
                                                        hover:bg-muted
                                                        hover:scale-110
                                                    "
                                                >
                                                    {
                                                        emoji
                                                    }
                                                </button>
                                            )
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* send */}
                    <Button
                        type="button"
                        size="icon"
                        onClick={
                            handleSendMessage
                        }
                        disabled={
                            (!draftMessage.trim() &&
                                pendingAttachments.length ===
                                0) ||
                            !activeConversationId ||
                            isSending
                        }
                        className="
                            h-11
                            w-11
                            rounded-2xl
                            bg-emerald-500
                            shadow-lg
                            shadow-emerald-500/20
                            transition-all
                            hover:bg-emerald-600
                            disabled:shadow-none
                        "
                    >
                        {isSending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </footer>
    );
};

export default ChatInput;