import { RefObject, useEffect, useRef, useState } from 'react'
import {
    Search,
    ShieldCheck,
    UserRound,
    ChevronDown,
} from "lucide-react";
import { ContactItem, ContactRole } from '@/types';
import { getAvatarColor, getInitials } from '@/lib/utils';
import { PresenceItem } from '@/apis/messagesAPI';

interface ChatsTabProps {
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

const ChatsTab = ({
    contactFilter,
    setContactFilter,
    searchTerm,
    setSearchTerm,
    filteredContacts,
    isLoading,
    openContactChat,
    activeConversationId,
    selectedContact,
    conversationByUserId,
    presenceMap,
    openingUserId
}: ChatsTabProps) => {
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
        <div className='flex flex-col gap-2 h-full overflow-hidden'>
            <div className='space-y-2'>
                <div ref={dropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-sm font-medium text-gray-700"
                    >
                        <div className="flex items-center gap-2">
                            {contactFilter === "guard" ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <UserRound className="h-4 w-4 text-blue-500" />}
                            <span>{contactFilter === "guard" ? "Guards" : "Clients"}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {(["guard", "client"] as ContactRole[]).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => { setContactFilter(role); setDropdownOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors ${contactFilter === role ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}
                                >
                                    {role === "guard" ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <UserRound className="h-4 w-4 text-blue-500" />}
                                    {role === "guard" ? "Guards" : "Clients"}
                                    {contactFilter === role && <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">Active</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search ${contactFilter === "guard" ? "guards" : "clients"}…`}
                        className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="px-4 pb-2 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{contactFilter === "guard" ? "Guards" : "Clients"}</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-1.5 py-0.5">{filteredContacts.length}</span>
            </div>

            <div className="h-96 overflow-y-auto">
                {isLoading && (
                    <div className="flex flex-col gap-2 p-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="h-11 w-11 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                                    <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && filteredContacts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                            {contactFilter === "guard" ? <ShieldCheck className="h-7 w-7 text-gray-400" /> : <UserRound className="h-7 w-7 text-gray-400" />}
                        </div>
                        <p className="text-sm font-medium text-gray-500">No {contactFilter === "guard" ? "guards" : "clients"} found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                )}
                <div>
                    {filteredContacts.map((contact) => {
                        const knownCid = conversationByUserId[contact.id];
                        const isActive = selectedContact?.id === contact.id || (!!activeConversationId && knownCid === activeConversationId);
                        const online = presenceMap.get(contact.id)?.isOnline ?? false;
                        return (
                            <button
                                key={contact.id}
                                type="button"
                                onClick={() => openContactChat(contact)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-gray-50 relative ${isActive ? "bg-emerald-50 border-l-[3px] border-l-emerald-500" : "hover:bg-gray-50/80 border-l-[3px] border-l-transparent"}`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`h-11 w-11 rounded-full bg-linear-to-br ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-[13px] font-bold shadow-sm overflow-hidden`}>
                                        {contact.avatar ? <img src={contact.avatar} alt={contact.name} className="h-full w-full object-cover" /> : getInitials(contact.name)}
                                    </div>
                                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-gray-300"}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-[13.5px] font-semibold truncate ${isActive ? "text-emerald-900" : "text-gray-800"}`}>{contact.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        {contact.role === "guard" ? <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" /> : <UserRound className="h-3 w-3 text-blue-400 shrink-0" />}
                                        <p className="text-[11.5px] text-gray-400 truncate">
                                            {openingUserId === contact.id ? "Opening…" : online ? "Online now" : contact.role === "guard" ? "Guard" : "Client"}
                                        </p>
                                    </div>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default ChatsTab


