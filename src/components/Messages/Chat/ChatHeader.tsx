import { PresenceItem } from "@/apis/messagesAPI";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
import { cn, formatPresence } from "@/lib/utils";
import { ContactItem } from "@/types";

interface ChatHeaderProps {
    selectedContact: ContactItem | null;
    isOtherTyping: boolean;
    selectedPresence?: PresenceItem | null;
}

const ChatHeader = ({ selectedContact, isOtherTyping, selectedPresence }: ChatHeaderProps) => {
    return (
        <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                    <UserAvatar src={selectedContact?.avatar} name={selectedContact?.name} />
                    <span
                        className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
                            selectedPresence?.isOnline ? "bg-emerald-500" : "bg-gray-300"
                        )}
                    />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate leading-tight">{selectedContact?.name}</p>
                    <p
                        className={cn("text-xs truncate leading-tight",
                            selectedPresence?.isOnline ? "text-emerald-500 font-medium" : "text-gray-400"
                        )}>
                        {isOtherTyping ? "typing..." : selectedPresence ? formatPresence(selectedPresence.isOnline, selectedPresence.lastSeenAt) : "Checking..."}
                    </p>
                </div>
            </div>
        </header>
    );
}

export default ChatHeader;

