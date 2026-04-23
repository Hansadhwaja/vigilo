import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BroadcastTab from './BroadCast/BroadcastTab'
import ChatsTab from './ChatsTab'
import { ContactItem, ContactRole } from '@/types';
import { PresenceItem } from '@/apis/messagesAPI';

interface MessageTabsProps {
    contactFilter: ContactRole;
    setContactFilter: (c: ContactRole) => void
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    setEmojiOpen: (e: boolean) => void;
    filteredContacts: ContactItem[];
    isLoading: boolean;
    openContactChat: (c: ContactItem) => void;
    activeConversationId: string;
    selectedContact: ContactItem | null;
    conversationByUserId: Record<string, string>;
    presenceMap: Map<string, PresenceItem>;
    openingUserId: string;
}

const MessageTabs = ({
    contactFilter,
    setContactFilter,
    searchTerm,
    setSearchTerm,
    setEmojiOpen,
    filteredContacts,
    isLoading,
    openContactChat,
    activeConversationId,
    selectedContact,
    conversationByUserId,
    presenceMap,
    openingUserId
}: MessageTabsProps) => {
    return (
        <Tabs defaultValue='chats' className='flex-1'>
            <TabsList className="grid w-full h-auto grid-cols-2">
                <TabsTrigger value="chats">Chats</TabsTrigger>
                <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
            </TabsList>
            <TabsContent value='chats'>
                <ChatsTab
                    contactFilter={contactFilter}
                    setContactFilter={setContactFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setEmojiOpen={setEmojiOpen}
                    filteredContacts={filteredContacts}
                    isLoading={isLoading}
                    openContactChat={openContactChat}
                    activeConversationId={activeConversationId}
                    selectedContact={selectedContact}
                    conversationByUserId={conversationByUserId}
                    presenceMap={presenceMap}
                    openingUserId={openingUserId}
                />
            </TabsContent>
            <TabsContent value='broadcast'>
                <BroadcastTab />
            </TabsContent>
        </Tabs>
    )
}

export default MessageTabs