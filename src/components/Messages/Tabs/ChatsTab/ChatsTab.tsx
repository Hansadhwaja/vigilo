import { ShieldCheck, Users } from "lucide-react";
import { PresenceItem } from "@/apis/messagesAPI";
import { Guard } from "@/apis/guardsApi";
import MessageSearchFilters from "./MessageSearchFilters";
import GuardListCard from "./GuardListCard";

interface ChatsTabProps {
    isLoading: boolean;
    openGuardChat: (c: Guard) => void;
    activeConversationId: string;

    selectedGuard: Guard | null;

    conversationByUserId: Record<string, string>;

    presenceMap: Map<string, PresenceItem>;

    openingUserId: string;

    guards: Guard[];
}

const ChatsTab = ({
    isLoading,
    openGuardChat,
    activeConversationId,
    selectedGuard,
    conversationByUserId,
    presenceMap,
    openingUserId,
    guards,
}: ChatsTabProps) => {
    return (
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
            <MessageSearchFilters />

            <div className="flex items-center justify-between px-1">

                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                        <Users
                            size={16}
                            className="text-emerald-600"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Guards
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Active contacts
                        </p>
                    </div>
                </div>
                <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-500 px-2 text-sm font-semibold text-white shadow-sm">
                    {guards.length}
                </div>
            </div>

            {/* list */}
            <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border border-border/50 p-2 bg-muted/20 no-scrollbar">
                {/* loading */}
                {isLoading && (
                    <div className="flex flex-col gap-3 p-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 rounded-2xl bg-background p-3 animate-pulse"
                            >
                                <div className="h-12 w-12 rounded-full bg-muted" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-3/4 rounded-full bg-muted" />

                                    <div className="h-2.5 w-1/2 rounded-full bg-muted/70" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* empty */}
                {!isLoading && guards.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                            <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h3 className="text-sm font-semibold text-foreground">
                            No guards found
                        </h3>

                        <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                            Try changing your search or
                            filters to find available
                            guards.
                        </p>
                    </div>
                )}

                {/* guard list */}
                {!isLoading && guards.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {guards.map((guard) => (
                            <GuardListCard
                                key={guard.id}
                                guard={guard}
                                openGuardChat={openGuardChat}
                                activeConversationId={activeConversationId}
                                selectedGuard={selectedGuard}
                                conversationByUserId={conversationByUserId}
                                presenceMap={presenceMap}
                                openingUserId={openingUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ChatsTab;