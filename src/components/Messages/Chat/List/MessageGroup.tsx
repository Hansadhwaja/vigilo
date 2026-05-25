import {
    BaseMessageProps,
    MessageController,
    MessageGroupType,
} from "@/types";

import MessageItemRow from "./MessageItemRow";
import { CalendarDays } from "lucide-react";

interface Props extends MessageController, BaseMessageProps {
    group: MessageGroupType;
}

const MessageGroup = ({ group, ...rest }: Props) => {
    return (
        <section className="relative py-3">
            {/* Date Divider */}
            <div className="sticky top-2 z-10 mb-5 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-500" />

                    <span className="text-[11px] font-semibold tracking-wide text-slate-600">
                        {group.label}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="space-y-1">
                {group.messages.map((msg, idx) => (
                    <MessageItemRow
                        key={msg.id}
                        msg={msg}
                        prevMsg={group.messages[idx - 1]}
                        {...rest}
                    />
                ))}
            </div>
        </section>
    );
};

export default MessageGroup;