import { RefObject } from "react";
import { MessageCircle, Sparkles } from "lucide-react";

import { PresenceItem } from "@/apis/messagesAPI";
import { Separator } from "@/components/ui/separator";

import CustomHeader from "../common/Header/CustomHeader";
import MessageTabs from "./Tabs";

import { Guard } from "@/apis/guardsApi";

interface LeftSideProps {
    guards: Guard[];

    isLoading: boolean;

    openGuardChat: (c: Guard) => void;

    activeConversationId: string;

    selectedGuard: Guard | null;

    conversationByUserId: Record<string, string>;

    presenceMap: Map<string, PresenceItem>;

    openingUserId: string;
}

const LeftSide = ({
    guards,
    isLoading,
    openGuardChat,
    activeConversationId,
    selectedGuard,
    conversationByUserId,
    presenceMap,
    openingUserId,
}: LeftSideProps) => {
    return (
        <aside className="relative flex w-90 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-linear-to-b from-background via-background to-muted/20">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex h-full min-h-0 flex-col gap-4 p-4">
                <CustomHeader
                    title="Messages"
                    description="Secure communications hub"
                    others={
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                            <MessageCircle
                                size={20}
                                className="text-white"
                            />

                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-white">
                                <Sparkles
                                    size={10}
                                    className="text-emerald-500"
                                />
                            </div>
                        </div>
                    }
                />
                <Separator />
                <div className="min-h-0 flex-1 overflow-hidden">
                    <MessageTabs
                        guards={guards}
                        isLoading={isLoading}
                        openGuardChat={openGuardChat}
                        activeConversationId={
                            activeConversationId
                        }
                        selectedGuard={selectedGuard}
                        conversationByUserId={
                            conversationByUserId
                        }
                        presenceMap={presenceMap}
                        openingUserId={openingUserId}
                    />
                </div>
            </div>
        </aside>
    );
};

export default LeftSide;