import { RefObject, useEffect, useRef, useState } from 'react'
import {
    MessageCircle,
    Search,
    ShieldCheck,
    UserRound,
    ChevronDown,
} from "lucide-react";
import { ContactItem, ContactRole } from '@/types';
import { getAvatarColor, getInitials } from '@/lib/utils';
import { PresenceItem } from '@/apis/messagesAPI';
import MessageTabs from './Tabs';
import { Separator } from '../ui/separator';


interface LeftSideProps {
    contactFilter: ContactRole;
    setContactFilter: (c: ContactRole) => void
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    emojiRef: RefObject<HTMLDivElement | null>;
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

const LeftSide = ({
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
}: LeftSideProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <aside className="w-85 shrink-0 flex flex-col bg-white border-r border-gray-100">
            <div className="h-full px-3 py-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">Messages</h1>
                        <p className="text-[11px] text-gray-400 mt-0.5">Secure communications hub</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
                        <MessageCircle size={18} className="text-white" />
                    </div>
                </div>
                <Separator />
                <MessageTabs
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
            </div>
        </aside>
    )
}

export default LeftSide


