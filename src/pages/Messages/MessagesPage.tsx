import { useEffect, useMemo, useRef, useState } from "react";
import {
  PresenceItem,
  useCreateOrGetDirectConversationMutation,
  useGetBulkPresenceQuery,
  useHeartbeatPresenceMutation,
} from "@/apis/messagesAPI";
import EmptyConversion from "@/components/Messages/EmptyConversion";
import { ContactItem, ContactRole, PresenceUpdateEvent } from "@/types";
import { resolveUserId } from "@/lib/utils";
import LeftSide from "@/components/Messages/LeftSide";
import MessageChatSection from "@/components/Messages/Chat/MessageChatSection";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { useGetAllClientsQuery } from "@/apis/usersApi";
import { toast } from "sonner";

const MessagesPage = () => {
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

  const [openingUserId, setOpeningUserId] = useState<string>("");
  const [contactFilter, setContactFilter] = useState<ContactRole>("guard");
  const [searchTerm, setSearchTerm] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [conversationByUserId, setConversationByUserId] = useState<Record<string, string>>({});
  const [livePresenceByUserId, setLivePresenceByUserId] = useState<Record<string, PresenceUpdateEvent>>({});

  const emojiRef = useRef<HTMLDivElement | null>(null);

  const [heartbeatPresence] = useHeartbeatPresenceMutation();

  const { data: guardsResponse, isLoading: isGuardsLoading } = useGetAllGuardsQuery({ page: 1, limit: 1000 });
  const { data: clientsResponse, isLoading: isClientsLoading } = useGetAllClientsQuery();

  const authUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }, []);

  const authUserId = String(authUser?.id || authUser?._id || "");

  const contacts = useMemo<ContactItem[]>(() => {
    const guards = (guardsResponse?.data || []).reduce<ContactItem[]>((acc, guard: any) => {
      const resolvedId = resolveUserId(guard);
      if (resolvedId === null) return acc;
      acc.push({ id: String(resolvedId), apiUserId: resolvedId, name: guard.name, avatar: undefined, role: "guard" });
      return acc;
    }, []);
    const clients = (clientsResponse?.data || []).reduce<ContactItem[]>((acc, client: any) => {
      const resolvedId = resolveUserId(client);
      if (resolvedId === null) return acc;
      acc.push({ id: String(resolvedId), apiUserId: resolvedId, name: client.name, avatar: client.avatar, role: "client" });
      return acc;
    }, []);
    return [...guards, ...clients].filter((c) => c.id !== authUserId).sort((a, b) => a.name.localeCompare(b.name));
  }, [authUserId, guardsResponse?.data, clientsResponse?.data]);

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const byRole = contacts.filter((c) => c.role === contactFilter);
    if (!query) return byRole;
    return byRole.filter((c) => c.name.toLowerCase().includes(query));
  }, [contactFilter, contacts, searchTerm]);

  const presenceIds = useMemo(() => filteredContacts.map((c) => c.id), [filteredContacts]);

  const [createOrGetConversation, { isLoading: isOpeningConversation }] = useCreateOrGetDirectConversationMutation();
  const { data: presenceRows = [] } = useGetBulkPresenceQuery(
    presenceIds,
    {
      skip: presenceIds.length === 0,
      pollingInterval: 15000
    });


  const presenceMap = useMemo(() => {
    const map = new Map(presenceRows.map((row: PresenceItem) => [String(row.userId), row]));
    Object.values(livePresenceByUserId).forEach((row) => {
      map.set(String(row.userId), row);
    });
    return map;
  }, [livePresenceByUserId, presenceRows]);

  const openContactChat = async (contact: ContactItem) => {
    setSelectedContact(contact);
    const targetUserId = contact.apiUserId;
    if (!targetUserId || !String(targetUserId).trim()) {
      toast.error("Missing user id");
      return;
    }
    if (String(targetUserId) === authUserId) {
      toast.error("Cannot create conversation with yourself");
      return;
    }
    const known = conversationByUserId[contact.id];
    if (known) {
      setActiveConversationId(known);
      return;
    }
    try {
      setOpeningUserId(contact.id);
      const response = await createOrGetConversation({ userId: String(targetUserId) }).unwrap();
      setConversationByUserId((prev) => ({ ...prev, [contact.id]: response.conversationId }));
      setActiveConversationId(response.conversationId);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to open conversation");
    } finally { setOpeningUserId(""); }
  };

  useEffect(() => {
    if (!selectedContact) return;
    if (selectedContact.role !== contactFilter) {
      setSelectedContact(null);
      setActiveConversationId("");
    }
  }, [contactFilter, selectedContact]);

  useEffect(() => {
    const heartbeat = () => heartbeatPresence().catch(() => undefined);
    heartbeat();
    const timer = window.setInterval(heartbeat, 45000);
    return () => window.clearInterval(timer);
  }, [heartbeatPresence]);

  return (
    <div className="flex rounded-2xl shadow-2xl border border-gray-200/60 h-full min-h-0">
      <LeftSide
        contactFilter={contactFilter}
        setContactFilter={setContactFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        emojiRef={emojiRef}
        setEmojiOpen={setEmojiOpen}
        filteredContacts={filteredContacts}
        isLoading={isGuardsLoading || isClientsLoading}
        openContactChat={openContactChat}
        activeConversationId={activeConversationId}
        selectedContact={selectedContact}
        conversationByUserId={conversationByUserId}
        presenceMap={presenceMap}
        openingUserId={openingUserId}
      />

      <section className="flex-1 flex flex-col min-h-0">
        {selectedContact ? (
          <MessageChatSection
            activeConversationId={activeConversationId}
            selectedContact={selectedContact}
            authUserId={authUserId}
            emojiOpen={emojiOpen}
            emojiRef={emojiRef}
            setEmojiOpen={setEmojiOpen}
            isOpeningConversation={isOpeningConversation}
            presenceMap={presenceMap}
            setLivePresenceByUserId={setLivePresenceByUserId}
          />
        ) : (
          <EmptyConversion contactFilter={contactFilter} />
        )}
      </section>
    </div>
  );
}

export default MessagesPage;

