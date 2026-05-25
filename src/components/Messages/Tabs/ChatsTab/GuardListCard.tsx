import { Guard } from '@/apis/guardsApi';
import { PresenceItem } from '@/apis/messagesAPI';
import UserAvatar from '@/components/common/Avatar/UserAvatar';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface Props {
    guard: Guard;
    openGuardChat: (c: Guard) => void;
    activeConversationId: string;
    selectedGuard: Guard | null;
    conversationByUserId: Record<string, string>;
    presenceMap: Map<string, PresenceItem>;
    openingUserId: string;
}

const GuardListCard = ({
    guard,
    conversationByUserId,
    selectedGuard,
    presenceMap,
    openingUserId,
    openGuardChat,
    activeConversationId
}: Props) => {

    const knownCid =
        conversationByUserId[
        guard.id
        ];

    const isActive =
        selectedGuard?.id ===
        guard.id ||
        (!!activeConversationId &&
            knownCid ===
            activeConversationId);

    const online =
        presenceMap.get(
            guard.id
        )?.isOnline ?? false;

    const isOpening =
        openingUserId ===
        guard.id;

    return (
        <button
            key={guard.id}
            type="button"
            onClick={() =>
                openGuardChat(
                    guard
                )
            }
            className={cn("group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-200",
                isActive
                    ? "border-emerald-200 bg-emerald-500/8 shadow-sm "
                    : "border-transparent bg-background / 80 hover:border-border hover:bg-background"
            )}

        >
            {/* glow */}
            {isActive && (
                <div className="absolute inset-y-3 left-0 w-1 rounded-full bg-emerald-500" />
            )}

            {/* avatar */}
            <div className="relative shrink-0">
                <UserAvatar
                    src=""
                    name={
                        guard.name
                    }
                />

                <span
                    className={cn(" absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background",
                        online
                            ? "bg-emerald-500"
                            : "bg-muted-foreground"
                    )}

                />
            </div>

            {/* content */}
            <div className="min-w-0 flex-1">
                <p className={cn(" truncate text-sm font-semibold",
                    isActive
                        ? "text-emerald-900"
                        : "text-foreground"
                )}

                >
                    {guard.name}
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                    <ShieldCheck
                        size={12}
                        className="shrink-0 text-emerald-500"
                    />

                    <p className="truncate text-xs text-muted-foreground">
                        {isOpening
                            ? "Opening conversation..."
                            : online
                                ? "Online now"
                                : "Available for communication"}
                    </p>
                </div>
            </div>

            {/* active dot */}
            {isActive && (
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
            )}
        </button>
    );

}

export default GuardListCard