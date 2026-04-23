import { useRef, useState } from "react";

export const useChatController = () => {
    const socketRef = useRef<any>(null);

    const [activeConversationId, setActiveConversationId] = useState("");
    const [selectedContact, setSelectedContact] = useState<any>(null);

    const selectContact = (contact: any, conversationId?: string) => {
        setSelectedContact(contact);
        if (conversationId) setActiveConversationId(conversationId);
    };

    return {
        socketRef,
        activeConversationId,
        setActiveConversationId,
        selectedContact,
        selectContact,
    };
};