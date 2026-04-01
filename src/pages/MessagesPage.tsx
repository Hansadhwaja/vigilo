import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  ChevronDown,
  Clock,
  CheckCheck,
  Check,
  Smile,
  Paperclip,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllGuardsQuery,
} from "../apis/guardsApi";
import { useGetAllClientsQuery } from "../apis/usersApi";
import {
  useCreateOrGetDirectConversationMutation,
  useDeleteMessageForEveryoneMutation,
  useDeleteMessageForMeMutation,
  useEditMessageMutation,
  useGetBulkPresenceQuery,
  useGetMessagesQuery,
  useHeartbeatPresenceMutation,
  useMarkMessagesReadMutation,
  useSendMessageMutation,
} from "../apis/messagesAPI";

type ContactRole = "guard" | "client";

interface ContactItem {
  id: string;
  apiUserId: string | number;
  name: string;
  avatar?: string;
  role: ContactRole;
}

interface PendingAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

interface SocketMessageEvent {
  id: string;
  conversationId: string;
  senderId: string;
}

interface PresenceUpdateEvent {
  userId: string;
  isOnline: boolean;
  lastSeenAt: string | null;
}

interface TypingEvent {
  userId: string;
  conversationId: string;
}

const SOCKET_BASE_URL = "https://vigilo-backend-1.onrender.com";
const SOCKET_HEARTBEAT_MS = 30000;

const EMOJI_SET = [
  "😀","😁","😂","😅","😊","😍","😘","😎",
  "🤝","👏","👍","🙏","🔥","🎉","✅","💬",
  "📌","📷","📎","🛡️",
];

const resolveUserId = (row: any): string | number | null => {
  if (!row || typeof row !== "object") return null;
  if (row.userId !== undefined && row.userId !== null && String(row.userId).trim()) return row.userId;
  if (row.id !== undefined && row.id !== null && String(row.id).trim()) return row.id;
  if (row._id !== undefined && row._id !== null && String(row._id).trim()) return row._id;
  return null;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatPresence = (isOnline: boolean, lastSeenAt: string | null) => {
  if (isOnline) return "online";
  if (!lastSeenAt) return "offline";
  const date = new Date(lastSeenAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "last seen just now";
  if (mins < 60) return `last seen ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `last seen ${hrs}h ago`;
  return `last seen ${date.toLocaleDateString()}`;
};

const getStatusTick = (status?: string) => {
  const normalized = String(status || "sent").toLowerCase();

  if (normalized === "seen" || normalized === "read") {
    return <CheckCheck size={13} className="text-blue-500" />;
  }

  if (normalized === "delivered") {
    return <CheckCheck size={13} />;
  }

  return <Check size={13} />;
};

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-blue-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-yellow-600",
];

const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── WhatsApp-style message action dropdown ────────────────────────────────
interface MessageMenuProps {
  isMine: boolean;
  messageId: string;
  content: string | null;
  onEdit: (id: string, content: string | null) => void;
  onDeleteForEveryone: (id: string) => void;
  onDeleteForMe: (id: string) => void;
}

function MessageMenu({ isMine, messageId, content, onEdit, onDeleteForEveryone, onDeleteForMe }: MessageMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative z-10">
      {/* Small chevron button — shown on parent group-hover */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-5 w-5 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-600 transition-all"
        aria-label="Message options"
      >
        <ChevronDown size={11} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          className={`absolute top-6 w-48 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-300/40 overflow-hidden ${
            isMine ? "right-0" : "left-0"
          }`}
        >
          {isMine && (
            <button
              type="button"
              onClick={() => { setOpen(false); onEdit(messageId, content); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={14} className="text-gray-500" />
              Edit message
            </button>
          )}
          {isMine && <div className="h-px bg-gray-100 mx-3" />}
          {isMine ? (
            <button
              type="button"
              onClick={() => { setOpen(false); onDeleteForEveryone(messageId); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Delete for everyone
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setOpen(false); onDeleteForMe(messageId); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Delete for me
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contactFilter, setContactFilter] = useState<ContactRole>("guard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [draftMessage, setDraftMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [openingUserId, setOpeningUserId] = useState<string>("");
  const [conversationByUserId, setConversationByUserId] = useState<Record<string, string>>({});
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [livePresenceByUserId, setLivePresenceByUserId] = useState<Record<string, PresenceUpdateEvent>>({});
  const [socketConnected, setSocketConnected] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMarkedRef = useRef<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeConversationRef = useRef<string>("");
  const selectedContactRef = useRef<ContactItem | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const shouldEmitTypingRef = useRef(true);

  const authUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }, []);

  const authUserId = String(authUser?.id || authUser?._id || "");

  const { data: guardsResponse, isLoading: isGuardsLoading } = useGetAllGuardsQuery({ page: 1, limit: 1000 });
  const { data: clientsResponse, isLoading: isClientsLoading } = useGetAllClientsQuery();

  const [createOrGetConversation, { isLoading: isOpeningConversation }] = useCreateOrGetDirectConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [editMessage, { isLoading: isEditingMessage }] = useEditMessageMutation();
  const [deleteMessageForEveryone] = useDeleteMessageForEveryoneMutation();
  const [deleteMessageForMe] = useDeleteMessageForMeMutation();
  const [markMessagesRead] = useMarkMessagesReadMutation();
  const [heartbeatPresence] = useHeartbeatPresenceMutation();

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
  const { data: presenceRows = [] } = useGetBulkPresenceQuery(presenceIds, { skip: presenceIds.length === 0, pollingInterval: 15000 });
  const presenceMap = useMemo(() => {
    const map = new Map(presenceRows.map((row) => [String(row.userId), row]));
    Object.values(livePresenceByUserId).forEach((row) => {
      map.set(String(row.userId), row);
    });
    return map;
  }, [livePresenceByUserId, presenceRows]);

  const { data: messagesResponse, refetch: refetchMessages, isFetching: isMessagesFetching } = useGetMessagesQuery(
    { conversationId: activeConversationId, limit: 50 },
    { skip: !activeConversationId, pollingInterval: 2500, refetchOnMountOrArgChange: true }
  );
  const messageList = messagesResponse?.messages || [];

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setEmojiOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!selectedContact) return;
    if (selectedContact.role !== contactFilter) { setSelectedContact(null); setActiveConversationId(""); }
  }, [contactFilter, selectedContact]);

  useEffect(() => {
    const heartbeat = () => heartbeatPresence().catch(() => undefined);
    heartbeat();
    const timer = window.setInterval(heartbeat, 45000);
    return () => window.clearInterval(timer);
  }, [heartbeatPresence]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !authUserId) return;

    const socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("register", { token });

      if (activeConversationRef.current) {
        socket.emit("joinConversation", activeConversationRef.current);
      }
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("newMessage", (payload: SocketMessageEvent) => {
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    });

    socket.on("receiveMessage", (payload: SocketMessageEvent) => {
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
        socket.emit("markSeen", { messageId: payload.id, conversationId: payload.conversationId });
      }
    });

    socket.on("messageUpdated", (payload: { conversationId: string }) => {
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    });

    socket.on("messageDeleted", (payload: { conversationId: string }) => {
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    });

    socket.on("messageDeletedForMe", (payload: { conversationId: string; userId: string }) => {
      if (String(payload?.userId) !== authUserId) return;
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    });

    socket.on("messageSeen", (payload: { conversationId: string }) => {
      if (payload?.conversationId && payload.conversationId === activeConversationRef.current) {
        refetchMessages();
      }
    });

    socket.on("userTyping", (payload: TypingEvent) => {
      if (!payload?.conversationId || payload.conversationId !== activeConversationRef.current) return;
      const currentContactId = selectedContactRef.current?.id;
      if (currentContactId && String(payload.userId) !== currentContactId) return;
      setIsOtherTyping(true);
    });

    socket.on("userStoppedTyping", (payload: TypingEvent) => {
      if (!payload?.conversationId || payload.conversationId !== activeConversationRef.current) return;
      const currentContactId = selectedContactRef.current?.id;
      if (currentContactId && String(payload.userId) !== currentContactId) return;
      setIsOtherTyping(false);
    });

    socket.on("presence:update", (payload: PresenceUpdateEvent) => {
      if (!payload?.userId) return;
      setLivePresenceByUserId((prev) => ({
        ...prev,
        [String(payload.userId)]: {
          userId: String(payload.userId),
          isOnline: !!payload.isOnline,
          lastSeenAt: payload.lastSeenAt,
        },
      }));
    });

    const heartbeatTimer = window.setInterval(() => {
      if (socket.connected) {
        socket.emit("presence:heartbeat");
      }
    }, SOCKET_HEARTBEAT_MS);

    return () => {
      window.clearInterval(heartbeatTimer);
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [authUserId, refetchMessages]);

  useEffect(() => {
    if (!activeConversationId || !socketConnected || !socketRef.current) return;
    setIsOtherTyping(false);
    shouldEmitTypingRef.current = true;
    socketRef.current.emit("joinConversation", activeConversationId);
  }, [activeConversationId, socketConnected]);

  useEffect(() => {
    if (!activeConversationId || messageList.length === 0) return;
    const lastMessage = messageList[messageList.length - 1];
    if (!lastMessage) return;
    const markKey = `${activeConversationId}:${lastMessage.id}`;
    if (markKey === lastMarkedRef.current) return;
    lastMarkedRef.current = markKey;
    if (socketRef.current?.connected) {
      socketRef.current.emit("markSeen", { messageId: lastMessage.id, conversationId: activeConversationId });
    }
    markMessagesRead({ conversationId: activeConversationId, messageId: lastMessage.id }).catch(() => { lastMarkedRef.current = ""; });
  }, [activeConversationId, markMessagesRead, messageList]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messageList]);

  const openContactChat = async (contact: ContactItem) => {
    setSelectedContact(contact);
    const targetUserId = contact.apiUserId;
    if (!targetUserId || !String(targetUserId).trim()) { toast.error("Missing user id"); return; }
    if (String(targetUserId) === authUserId) { toast.error("Cannot create conversation with yourself"); return; }
    const known = conversationByUserId[contact.id];
    if (known) { setActiveConversationId(known); return; }
    try {
      setOpeningUserId(contact.id);
      const response = await createOrGetConversation({ userId: String(targetUserId) }).unwrap();
      setConversationByUserId((prev) => ({ ...prev, [contact.id]: response.conversationId }));
      setActiveConversationId(response.conversationId);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to open conversation");
    } finally { setOpeningUserId(""); }
  };

  const handleSendMessage = async () => {
    if (!activeConversationId) return;
    const trimmed = draftMessage.trim();
    if (!trimmed && pendingAttachments.length === 0) return;
    const attachmentsPayload = pendingAttachments.map((f) => ({ name: f.name, type: f.type, size: f.size, content: f.dataUrl }));
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", {
          conversationId: activeConversationId,
          message: trimmed,
          type: attachmentsPayload.length ? "file" : "text",
          attachments: attachmentsPayload,
        });
        setDraftMessage("");
        setPendingAttachments([]);
        setEmojiOpen(false);
        shouldEmitTypingRef.current = true;
        socketRef.current.emit("stopTyping", { conversationId: activeConversationId });
        return;
      }

      await sendMessage({ conversationId: activeConversationId, content: trimmed || undefined, type: attachmentsPayload.length ? "file" : "text", attachments: attachmentsPayload }).unwrap();
      setDraftMessage(""); setPendingAttachments([]); setEmojiOpen(false);
      await refetchMessages();
    } catch (error: any) { toast.error(error?.data?.message || "Failed to send message"); }
  };

  const fileToDataUrl = (file: File) => new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result || ""));
    reader.onerror = () => rej(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const handlePickFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (files.length + pendingAttachments.length > 5) { toast.error("Max 5 files"); event.target.value = ""; return; }
    const tooLarge = files.find((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge) { toast.error(`${tooLarge.name} > 5MB`); event.target.value = ""; return; }
    try {
      const mapped = await Promise.all(files.map(async (f) => ({ id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`, name: f.name, type: f.type || "application/octet-stream", size: f.size, dataUrl: await fileToDataUrl(f) })));
      setPendingAttachments((prev) => [...prev, ...mapped]);
    } catch { toast.error("Some files could not be attached"); }
    finally { event.target.value = ""; }
  };

  const startEditMessage = (id: string, content: string | null) => { setEditingMessageId(id); setEditDraft(content || ""); };
  const cancelEditMessage = () => { setEditingMessageId(null); setEditDraft(""); };

  const handleSaveEditedMessage = async () => {
    if (!editingMessageId || !editDraft.trim()) { toast.error("Content required"); return; }
    try {
      if (socketRef.current?.connected && activeConversationId) {
        socketRef.current.emit("x", {
          messageId: editingMessageId,
          conversationId: activeConversationId,
          content: editDraft.trim(),
        });
        cancelEditMessage();
        return;
      }

      await editMessage({ messageId: editingMessageId, content: editDraft.trim() }).unwrap();
      cancelEditMessage(); await refetchMessages();
    } catch (error: any) { toast.error(error?.data?.message || "Failed to edit"); }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    if (!window.confirm("Delete for everyone?")) return;
    try {
      if (socketRef.current?.connected && activeConversationId) {
        socketRef.current.emit("deleteMessage", { messageId, conversationId: activeConversationId });
        if (editingMessageId === messageId) cancelEditMessage();
        return;
      }

      await deleteMessageForEveryone({ messageId }).unwrap();
      if (editingMessageId === messageId) cancelEditMessage();
      await refetchMessages();
    } catch (error: any) { toast.error(error?.data?.message || "Failed to delete"); }
  };

  const handleDeleteForMe = async (messageId: string) => {
    if (!window.confirm("Delete for you only?")) return;
    try {
      if (socketRef.current?.connected && activeConversationId) {
        socketRef.current.emit("deleteMessageForMe", { messageId, conversationId: activeConversationId });
        if (editingMessageId === messageId) cancelEditMessage();
        return;
      }

      await deleteMessageForMe({ messageId }).unwrap();
      if (editingMessageId === messageId) cancelEditMessage();
      await refetchMessages();
    } catch (error: any) { toast.error(error?.data?.message || "Failed to delete"); }
  };

  const selectedPresence = selectedContact ? presenceMap.get(selectedContact.id) : null;
  const isOnline = selectedPresence?.isOnline ?? false;

  const groupedMessages = useMemo(() => {
    const groups: { label: string; messages: typeof messageList }[] = [];
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const today = fmt(new Date()); const yesterday = fmt(new Date(Date.now() - 86400000));
    messageList.forEach((msg) => {
      const key = fmt(new Date(msg.createdAt));
      const label = key === today ? "Today" : key === yesterday ? "Yesterday" : key;
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.messages.push(msg);
      else groups.push({ label, messages: [msg] });
    });
    return groups;
  }, [messageList]);

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="h-[calc(100vh-4rem)] min-h-[600px] flex overflow-hidden rounded-2xl shadow-2xl border border-gray-200/60"
    >
      {/* ─── LEFT SIDEBAR ─────────────────────────────────── */}
      <aside className="w-[340px] flex-shrink-0 flex flex-col bg-white border-r border-gray-100">
        <div className="px-4 pt-5 pb-3 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">Messages</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Secure communications hub</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <MessageCircle size={18} className="text-white" />
            </div>
          </div>

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

        <div className="flex-1 overflow-y-auto">
          {(isGuardsLoading || isClientsLoading) && (
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
          {!isGuardsLoading && !isClientsLoading && filteredContacts.length === 0 && (
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
                    <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-[13px] font-bold shadow-sm overflow-hidden`}>
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
      </aside>

      {/* ─── RIGHT CHAT PANEL ─────────────────────────────── */}
      <section className="flex-1 flex flex-col min-w-0">
        {selectedContact ? (
          <>
            <header className="h-[65px] px-5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarColor(selectedContact.name)} flex items-center justify-center text-white text-[13px] font-bold overflow-hidden shadow-sm`}>
                    {selectedContact.avatar ? <img src={selectedContact.avatar} alt={selectedContact.name} className="h-full w-full object-cover" /> : getInitials(selectedContact.name)}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-gray-300"}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[14px] text-gray-900 truncate leading-tight">{selectedContact.name}</p>
                  <p className={`text-[11.5px] truncate leading-tight ${isOnline ? "text-emerald-500 font-medium" : "text-gray-400"}`}>
                    {isOtherTyping ? "typing..." : selectedPresence ? formatPresence(selectedPresence.isOnline, selectedPresence.lastSeenAt) : "checking…"}
                  </p>
                </div>
              </div>
              <div className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">Encrypted chat</div>
            </header>

            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0faf4 100%)`,
                backgroundSize: "60px 60px, 100% 100%",
              }}
            >
              {!activeConversationId && <div className="h-full flex items-center justify-center"><p className="text-sm text-gray-400">Loading conversation…</p></div>}
              {activeConversationId && isMessagesFetching && messageList.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Loading messages…</p>
                  </div>
                </div>
              )}
              {activeConversationId && !isMessagesFetching && messageList.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                      <MessageCircle className="h-7 w-7 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-2">No messages yet</p>
                    <p className="text-xs text-gray-400">Say hello to {selectedContact.name} 👋</p>
                  </div>
                </div>
              )}

              {groupedMessages.map(({ label, messages }) => (
                <div key={label}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200/60" />
                    <span className="text-[11px] font-semibold text-gray-400 bg-white/80 px-3 py-1 rounded-full border border-gray-200/60 shadow-sm">{label}</span>
                    <div className="flex-1 h-px bg-gray-200/60" />
                  </div>

                  {messages.map((msg, idx) => {
                    const isMine = String(msg.senderId) === authUserId;
                    const isFirstInGroup = !messages[idx - 1] || String(messages[idx - 1].senderId) !== String(msg.senderId);
                    const isEditingThis = editingMessageId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-3" : "mt-0.5"}`}
                      >
                        {!isMine && isFirstInGroup && (
                          <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarColor(selectedContact.name)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-1.5 mt-auto mb-1`}>
                            {getInitials(selectedContact.name)}
                          </div>
                        )}
                        {!isMine && !isFirstInGroup && <div className="w-[34px] shrink-0" />}

                        {/*
                         * group/msg — the hover container.
                         * The chevron button sits OUTSIDE the bubble, fades in on hover.
                         * For sent messages: chevron on the LEFT of the bubble.
                         * For received messages: chevron on the RIGHT of the bubble.
                         */}
                        <div className={`max-w-[72%] group/msg flex items-start gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>

                          {/* Chevron trigger — hidden until hover */}
                          {!msg.isDeletedForEveryone && !isEditingThis && (
                            <div className={`self-center opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150 shrink-0 ${isMine ? "mr-0.5" : "ml-0.5"}`}>
                              <MessageMenu
                                isMine={isMine}
                                messageId={msg.id}
                                content={msg.content}
                                onEdit={startEditMessage}
                                onDeleteForEveryone={handleDeleteForEveryone}
                                onDeleteForMe={handleDeleteForMe}
                              />
                            </div>
                          )}

                          {/* Bubble */}
                          <div
                            className={`${isMine ? "bg-[#d9fdd3] rounded-2xl rounded-tr-sm" : "bg-white rounded-2xl rounded-tl-sm"} px-3.5 py-2`}
                            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
                          >
                            {msg.replyTo && (
                              <div className={`mb-2 px-2.5 py-1.5 rounded-lg border-l-[3px] text-[11.5px] ${isMine ? "bg-[#c6f2c0] border-emerald-500" : "bg-gray-50 border-gray-300"}`}>
                                <p className="font-semibold text-emerald-700 leading-tight mb-0.5">
                                  {String(msg.replyTo.senderId) === authUserId ? "You" : selectedContact.name}
                                </p>
                                <p className="text-gray-500 truncate leading-snug">
                                  {msg.replyTo.isDeletedForEveryone ? "This message was deleted" : msg.replyTo.content}
                                </p>
                              </div>
                            )}

                            {isEditingThis ? (
                              <div className="space-y-2 min-w-[200px]">
                                <input
                                  value={editDraft}
                                  onChange={(e) => setEditDraft(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveEditedMessage(); if (e.key === "Escape") cancelEditMessage(); }}
                                  autoFocus
                                  className="w-full h-9 px-3 text-[13px] bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                                  placeholder="Edit your message"
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <button type="button" onClick={cancelEditMessage} className="px-2.5 py-1 text-[11px] rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">Cancel</button>
                                  <button type="button" onClick={handleSaveEditedMessage} disabled={isEditingMessage || !editDraft.trim()} className="px-2.5 py-1 text-[11px] rounded-md bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60">
                                    {isEditingMessage ? "Saving…" : "Save"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[13.5px] text-gray-900 leading-relaxed whitespace-pre-wrap break-words">
                                {msg.isDeletedForEveryone
                                  ? <span className="italic text-gray-400">🚫 This message was deleted</span>
                                  : msg.content || "(No text)"}
                              </p>
                            )}

                            <div className="flex items-center gap-1 mt-0.5 justify-end">
                              {msg.isEdited && !msg.isDeletedForEveryone && <span className="text-[10px] text-gray-400 italic">edited</span>}
                              <span className="text-[10.5px] text-gray-400">{formatMessageTime(msg.createdAt)}</span>
                              {isMine && (
                                <span className="text-gray-400">
                                  {getStatusTick(msg.status)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <footer className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              {!!pendingAttachments.length && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {pendingAttachments.map((file) => (
                    <div key={file.id} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                      <span className="max-w-[180px] truncate" title={file.name}>{file.name}</span>
                      <button type="button" onClick={() => setPendingAttachments((p) => p.filter((f) => f.id !== file.id))} className="text-emerald-700 hover:text-emerald-900"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handlePickFiles} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0">
                  <Paperclip size={18} />
                </button>
                <div ref={emojiRef} className="flex-1 relative">
                  {emojiOpen && (
                    <div className="absolute bottom-12 right-2 z-40 w-[260px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                      <p className="px-2 pb-1 text-[11px] text-gray-400">Pick an emoji</p>
                      <div className="grid grid-cols-5 gap-1">
                        {EMOJI_SET.map((emoji) => (
                          <button key={emoji} type="button" onClick={() => setDraftMessage((p) => `${p}${emoji}`)} className="h-9 w-9 rounded-lg text-lg hover:bg-emerald-50">{emoji}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    value={draftMessage}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setDraftMessage(nextValue);

                      if (!activeConversationId || !socketRef.current?.connected) {
                        return;
                      }

                      if (nextValue.trim()) {
                        if (shouldEmitTypingRef.current) {
                          socketRef.current.emit("typing", { conversationId: activeConversationId });
                          shouldEmitTypingRef.current = false;
                        }

                        if (typingTimeoutRef.current) {
                          window.clearTimeout(typingTimeoutRef.current);
                        }

                        typingTimeoutRef.current = window.setTimeout(() => {
                          if (socketRef.current?.connected && activeConversationRef.current) {
                            socketRef.current.emit("stopTyping", { conversationId: activeConversationRef.current });
                          }
                          shouldEmitTypingRef.current = true;
                          typingTimeoutRef.current = null;
                        }, 1500);
                      } else {
                        if (typingTimeoutRef.current) {
                          window.clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = null;
                        }
                        socketRef.current.emit("stopTyping", { conversationId: activeConversationId });
                        shouldEmitTypingRef.current = true;
                      }
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Type a message…"
                    disabled={!activeConversationId || isOpeningConversation}
                    className="w-full h-11 pl-4 pr-10 text-[13.5px] bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-400 disabled:opacity-50"
                  />
                  <button type="button" onClick={() => setEmojiOpen((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors">
                    <Smile size={17} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={(!draftMessage.trim() && pendingAttachments.length === 0) || !activeConversationId || isSending}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${(draftMessage.trim() || pendingAttachments.length > 0) && activeConversationId && !isSending ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200 hover:scale-105" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  {isSending ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 text-center max-w-sm px-6">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="h-24 w-24 rounded-3xl bg-white shadow-xl shadow-emerald-100 flex items-center justify-center">
                  <MessageCircle className="h-11 w-11 text-emerald-500" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 shadow-md shadow-emerald-200 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 h-7 w-7 rounded-xl bg-teal-500 shadow-md shadow-teal-200 flex items-center justify-center">
                  <UserRound className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Start a conversation</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Select a {contactFilter === "guard" ? "guard" : "client"} from the sidebar to open a secure chat.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live presence active
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                  <Clock size={11} />
                  Message receipts on
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
