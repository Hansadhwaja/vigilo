import { BaseMessageProps, MessageController, MessageGroupType } from "@/types";
import MessageItemRow from "./MessageItemRow";

interface Props extends MessageController, BaseMessageProps {
    group: MessageGroupType;
}

const MessageGroup = ({
    group,
    ...rest
}: Props) => {
    return (
        <div >
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200/60" />
                <span className="text-[11px] font-semibold text-gray-400 bg-white/80 px-3 py-1 rounded-full border border-gray-200/60 shadow-sm">{group.label}</span>
                <div className="flex-1 h-px bg-gray-200/60" />
            </div>

            {group.messages.map((msg, idx) => (
                <MessageItemRow
                    key={msg.id}
                    msg={msg}
                    prevMsg={group.messages[idx - 1]}
                    {...rest}
                />
            ))}
        </div>
    );
};

export default MessageGroup;