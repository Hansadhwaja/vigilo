import { MessageItem } from "@/apis/messagesAPI";

//Messages
export type ContactRole = "guard" | "client";

export interface ContactItem {
    id: string;
    apiUserId: string | number;
    name: string;
    avatar?: string;
    role: ContactRole;
}

export interface SocketMessageEvent {
    id: string;
    conversationId: string;
    senderId: string;
}

export interface PresenceUpdateEvent {
    userId: string;
    isOnline: boolean;
    lastSeenAt: string | null;
}

export interface TypingEvent {
    userId: string;
    conversationId: string;
}

export interface PendingAttachment {
    id: string;
    name: string;
    type: string;
    size: number;
    dataUrl: string;
}

export interface MessageGroupType {
    label: string;
    messages: MessageItem[];
}

export interface MessageController {
    editingMessageId: string | null;
    editDraft: string;
    setEditDraft: (value: string) => void;
    startEdit: (msg: MessageItem) => void;
    cancelEdit: () => void;
    saveEdit: () => void;
    onDeleteForEveryone: (id: string) => void;
    onDeleteForMe: (id: string) => void;
    isEditingMessage:boolean;
}

export interface BaseMessageProps {
    authUserId: string;
    selectedContact: ContactItem | null;
}

//Broadcast Message
export type FormValues = {
    broadcastType: "ALL" | "SELECTED";
    guardIds?: string[];
    projectId: string;
    message: string;
    attachment?: File;
};



//Main Layout

export interface Alarm {
    id: string;
    site: string;
    type: string;
    priority: string;
    priorityLevel: number;
    assigned?: string;
    assignedId?: string;
    eta?: string;
    slaTargetMins: number;
    sinceMins: number;
    monitoringCompany: string;
    license: string;
    licenseDetails: string;
    unitPrice: number;
    completed: boolean;
    completedAt: Date | undefined;
    createdAt: Date;
    description: string;
    location: string;
    resolvedAt?: Date;
    responseTime?: number;
    assignedAt?: Date;
}

export interface Incident {
    id: string;
    site: string;
    location: {
        name: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    type: string;
    severity: string;
    status: string;
    time: string;
    dateTime: Date;
    assigned?: string;
    assignedId?: string;
    reportedBy: string;
    reporterName: string;
    photo?: string;
    guardMessage: string;
    description: string;
    actionsTaken: string;
    clientNotified: boolean;
    priorityLevel: number;
    resolvedAt?: Date;
    createdAt?: Date;
}

export interface KPI {
    onDuty: number;
    openIncidents: number;
    openAlarms: number;
    patrolsDue: number;
    dailyRevenue: number;
    revenueGrowth: number;
    activeContracts: number;
    avgResponseTime: number;
}