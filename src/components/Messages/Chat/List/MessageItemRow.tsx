import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import { MessageItem } from "@/apis/messagesAPI";
import { BaseMessageProps, MessageController } from "@/types";
import MessageBubble from "./MessageBubble";

interface Props extends MessageController, BaseMessageProps {
    msg: MessageItem;
    prevMsg?: MessageItem;
}

const MessageItemRow = ({
    msg,
    prevMsg,
    authUserId,
    selectedContact,
    ...rest
}: Props) => {

    const isMine = String(msg.senderId) === authUserId;
    const isFirstInGroup = !prevMsg || String(prevMsg.senderId) !== String(msg.senderId);

    return (
        <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}
        >
            {!isMine && isFirstInGroup && (
                <div className={cn("h-7 w-7 rounded-full bg-linear-to-br flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-1.5 mt-auto mb-1",
                    getAvatarColor(selectedContact?.name ?? "User")
                )}
                >
                    {getInitials(selectedContact?.name ?? "User")}
                </div>
            )}

            {!isMine && !isFirstInGroup && <div className="w-8.5 shrink-0" />}

            <MessageBubble
                msg={msg}
                isMine={isMine}
                authUserId={authUserId}
                selectedContact={selectedContact}
                {...rest}
            />
        </div>
    );
};

export default MessageItemRow;