import {
    MoreVertical,
    Phone,
    ShieldCheck,
    Video,
} from "lucide-react";

import { Guard } from "@/apis/guardsApi";
import { PresenceItem } from "@/apis/messagesAPI";

import UserAvatar from "@/components/common/Avatar/UserAvatar";

import {
    cn,
    formatPresence,
} from "@/lib/utils";

interface ChatHeaderProps {
    selectedGuard: Guard | null;

    isOtherTyping: boolean;

    selectedPresence?: PresenceItem | null;
}

const ChatHeader = ({
    selectedGuard,
    isOtherTyping,
    selectedPresence,
}: ChatHeaderProps) => {
    const isOnline =
        selectedPresence?.isOnline;

    return (
        <header className="relative shrink-0 overflow-hidden border-b border-border/60 bg-background/90 backdrop-blur-xl">
            {/* glow */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between px-6 py-4">
                {/* left */}
                <div className="flex min-w-0 items-center gap-4">
                    {/* avatar */}
                    <div className="relative shrink-0">
                        <div
                            className={cn(
                                `
                                rounded-2xl
                                border
                                border-white/70
                                bg-background
                                p-0.5
                                shadow-lg
                                transition-all
                                `,
                                isOnline &&
                                "shadow-emerald-100"
                            )}
                        >
                            <UserAvatar
                                src=""
                                name={
                                    selectedGuard?.name
                                }
                            />
                        </div>

                        {/* online indicator */}
                        <span
                            className={cn(
                                `
                                absolute
                                bottom-0
                                right-0
                                h-4
                                w-4
                                rounded-full
                                border-[3px]
                                border-background
                                `,
                                isOnline
                                    ? "bg-emerald-500"
                                    : "bg-muted-foreground/40"
                            )}
                        />

                        {/* pulse */}
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 h-4 w-4 animate-ping rounded-full bg-emerald-400 opacity-40" />
                        )}
                    </div>

                    {/* content */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
                                {
                                    selectedGuard?.name
                                }
                            </h2>

                            <div className="flex h-5 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5">
                                <ShieldCheck
                                    size={10}
                                    className="text-emerald-600"
                                />

                                <span className="text-[10px] font-semibold text-emerald-700">
                                    Secure
                                </span>
                            </div>
                        </div>

                        <p
                            className={cn(
                                `
                                mt-1
                                truncate
                                text-sm
                                font-medium
                                transition-colors
                                `,
                                isOnline
                                    ? "text-emerald-600"
                                    : "text-muted-foreground"
                            )}
                        >
                            {isOtherTyping
                                ? "Typing..."
                                : selectedPresence
                                    ? formatPresence(
                                        selectedPresence.isOnline,
                                        selectedPresence.lastSeenAt
                                    )
                                    : "Checking status..."}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;