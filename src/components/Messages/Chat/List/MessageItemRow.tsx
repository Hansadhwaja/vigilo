import { MessageItem } from "@/apis/messagesAPI";

import {
    BaseMessageProps,
    MessageController,
} from "@/types";

import {
    cn,
    getAvatarColor,
    getInitials,
} from "@/lib/utils";

import MessageBubble from "./MessageBubble";

interface Props extends MessageController, BaseMessageProps {
    msg: MessageItem;
    prevMsg?: MessageItem;
}

const MessageItemRow = ({
    msg,
    prevMsg,
    authUserId,
    selectedGuard,
    ...rest
}: Props) => {
    const isMine = String(msg.senderId) === authUserId;

    const isFirstInGroup =
        !prevMsg ||
        String(prevMsg.senderId) !== String(msg.senderId);

    return (
        <div
            className={cn(
                "group flex w-full items-end gap-2 transition-all duration-200",
                isMine ? "justify-end" : "justify-start",
                isFirstInGroup ? "mt-5" : "mt-1"
            )}
        >
            {/* Avatar */}
            {!isMine ? (
                isFirstInGroup ? (
                    <div
                        className={cn(
                            "relative mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-[10px] font-bold text-white shadow-md ring-2 ring-white",
                            getAvatarColor(selectedGuard?.name ?? "User")
                        )}
                    >
                        {getInitials(selectedGuard?.name ?? "User")}

                        {/* Online Dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                ) : (
                    <div className="w-8 shrink-0" />
                )
            ) : null}

            {/* Bubble */}
            <div
                className={cn(
                    "flex flex-col min-w-35 max-w-[75%]",
                    isMine ? "items-end" : "items-start"
                )}
            >
                <MessageBubble
                    msg={msg}
                    isMine={isMine}
                    authUserId={authUserId}
                    selectedGuard={selectedGuard}
                    {...rest}
                />
            </div>
        </div>
    );
};

export default MessageItemRow;