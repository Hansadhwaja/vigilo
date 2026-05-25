import AppTabs from "@/components/common/Tab/AppTabs";
import BroadcastTab from "./BroadCast/BroadcastTab";
import ChatsTab from "./ChatsTab/ChatsTab";
import { PresenceItem } from "@/apis/messagesAPI";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Guard } from "@/apis/guardsApi";

interface MessageTabsProps {
    guards: Guard[];
    isLoading: boolean;
    openGuardChat: (c: Guard) => void;
    activeConversationId: string;
    selectedGuard: Guard | null;
    conversationByUserId: Record<string, string>;
    presenceMap: Map<string, PresenceItem>;
    openingUserId: string;
}

const MessageTabs = ({
    guards,
    isLoading,
    openGuardChat,
    activeConversationId,
    selectedGuard,
    conversationByUserId,
    presenceMap,
    openingUserId,
}: MessageTabsProps) => {
    const { getParam, setParam } = useQueryParams();

    const activeTab = getParam("tab", "chats");

    const handleTabChange = (value: string) => {
        setParam("tab", value);
    };

    const tabs = [
        {
            value: "chats",
            label: "Chats",

            content: (
                <ChatsTab
                    guards={guards}
                    isLoading={isLoading}
                    openGuardChat={openGuardChat}
                    activeConversationId={activeConversationId}
                    selectedGuard={selectedGuard}
                    conversationByUserId={conversationByUserId}
                    presenceMap={presenceMap}
                    openingUserId={openingUserId}
                />
            ),

            activeColor:
                "data-[state=active]:bg-sky-500",
        },

        {
            value: "broadcast",

            label: "Broadcast",

            content: <BroadcastTab />,

            activeColor:
                "data-[state=active]:bg-violet-500",
        },
    ];

    return (
        <div className="flex h-full min-h-0 flex-col">
            <AppTabs
                value={activeTab}
                onValueChange={handleTabChange}
                tabs={tabs}
                className="flex h-full min-h-0 flex-col"
                tabsListClassName="grid w-full grid-cols-2 shrink-0"
                contentClassName="flex-1 min-h-0 overflow-hidden"
            />
        </div>
    );
};
export default MessageTabs;