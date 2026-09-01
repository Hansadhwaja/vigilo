import { Guard } from "@/store/apis/guardsApi";
import { MessageItem } from "@/store/apis/messagesAPI";
import { InvoiceAlarmsFormValues, InvoiceOrdersFormValues } from "@/schemas";
import { billingIntervals } from "@/constants";
import { AlarmGuard } from "@/store/apis/alarmsAPI";

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
  isEditingMessage: boolean;
}

export interface BaseMessageProps {
  authUserId: string;
  selectedGuard: Guard | null;
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
  title: string;
  description?: string;

  alarmType: "intrusion" | "panic" | "fire" | "medical" | "motion" | "other";

  priority: "low" | "medium" | "high" | "critical";

  patrolRunId?: string;
  patrolId?: string;

  siteId?: string;
  siteName?: string;
  siteAddress?: string;

  vehicleId?: string;

  specificLocation?: string;

  guardIds: string[];

  etaMinutes?: number;
  slaTimeMinutes: number;
  totalTimeMinutes?: number;

  unitPrice: number;
  price: number;

  status: string;

  monitoringCompany?: string;
  license?: string;

  breach: boolean;

  createdAt: string;
  updatedAt: string;
  guards: AlarmGuard[];
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

//Invoice
export type InvoiceType = {
  amount: number;
  billingPeriod: string;
  clientCode: string;
  clientName: string;
  dueDate: string;
  id: string;
  invoiceNumber: string;
  issueDate: string;
  paidDate: string;
  services: {
    alarms: number;
    custom: number;
    orders: number;
  };
  status: string;
};

export type InvoiceSummary = {
  overdue: { count: number; totalAmount: number };
  paid: { count: number; totalAmount: number };
  pending: { count: number; totalAmount: number };
  sent: { count: number; totalAmount: number };
};

//SummaryCard
export type SummaryCardType = {
  title: string;
  value: string;
  className?: string;
};

export interface CalculateGrandTotalProps {
  orders?: InvoiceOrdersFormValues[];
  alarms?: InvoiceAlarmsFormValues[];
  services?: any[];
  serviceData: any;
}

//Scheduling
export interface OrganizedAssignment {
  id: string;

  shiftId: string;
  guardId: string;

  guardName: string;
  guardEmail: string;
  guardStatus: string;

  orderId: string;
  orderLocationName: string;
  orderName: string;
  orderAddress: string;

  description?: string;
  type?: string;
  status: string;

  statusColors: {
    bg: string;
    text: string;
  };

  timeSlot: string;

  start: string;
  end: string;
  duration: string;

  displayDate: string;

  originalStartDate: string;
  originalEndDate: string;

  allGuardIdsForShift: string[];
}

export type OrganizedShifts = {
  [date: string]: {
    [time: string]: OrganizedAssignment[];
  };
};

export interface TimeSlot {
  time: string; // "08:00"
  label: string; // "8 AM"
}

//HR&Compliance
//TimeSheets
export interface TimeSheet {
  changeShiftStatus: string | null;
  approvedStatus: "pending" | "approved" | "rejected";

  clockInTime: string | null;

  clockOutTime: string | null;

  date: string;

  description: string;

  guard: {
    id: string;
    name: string;
    email: string;
  };

  guardShiftStatus: "pending" | "accepted" | "rejected" | "completed" | string;

  images: string[];

  locationAddress: string;

  locationName: string;

  orderId: string;

  overtimeEndTime: string | null;

  overtimeHours: number;

  overtimeStartTime: string | null;

  requestOffStatus: "none" | "pending" | "approved" | "rejected" | string;

  serviceType: string;

  shiftEndTime: string;

  shiftId: string;

  shiftStartTime: string;

  shiftStatus: "pending" | "ongoing" | "completed" | "cancelled" | string;

  shiftTotalHours: number;

  shiftType: string;

  totalHours: number;
}

//Guard Payment
export interface GuardPaymentResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    payments: GuardPayment[];
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GuardPayment {
  id: string;

  guardId: string;

  hourlyRate: string;
  overtimeHourlyRate: string;

  regularHours: string;
  overtimeHours: string;
  totalHours: string;

  taxDeduction: string;
  otherDeductions: string;

  basePay: string;
  overtimePay: string;
  totalPay: string;

  paymentDate: string | null;

  status: "pending" | "approved" | "paid" | "processing";

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  guard: Guard;

  statics: GuardStatic[];
}

export interface GuardStatic {
  id: string;

  date: string;

  startTime: string;
  endTime: string;

  shiftTotalHours: number;

  status: "completed" | "cancelled" | "ended_early" | "overtime_ended";
}

//Settings
//User
export interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

//Plans

export type Plan = {
  id: string;
  name: string;
  description: string;
  amount: number | null;
  interval: BillingInterval;
  popular?: boolean;
  isActive: boolean;
  tenants?: number;
  currency?: string;
  features: string[];
};

export type BillingInterval = (typeof billingIntervals)[number]["value"];

//Billing->Transactions
export interface Transaction {
  id: string;
  stripeInvoiceId: string;
  stripePaymentIntentId: string | null;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  description: string;
  metadata: {
    invoice_number: string;
    hosted_invoice_url: string;
  };
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
