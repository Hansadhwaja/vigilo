// src/utils/statusColors.ts

export type StatusType =
  | "ongoing"
  | "completed"
  | "upcoming"
  | "accepted"
  | "approved"
  | "verified"
  | "confirmed"
  | "signed"
  | "allocated"
  | "pending"
  | "request_off_pending"
  | "request_off_approved"
  | "resolved"
  | "rejected"
  | "request_off_rejected"
  | "attention"
  | "expired"
  | "missing"
  | "absent"
  | "cancelled"
  | "missed"
  | "order_missed"
  | "missed_respond"
  | "missed_endovertime"
  | "ended_early"
  | "overtime"
  | "overtime_started"
  | "overtime_ended";

interface StatusColor {
  bg: string;
  text: string;
  border: string;
  label: string;
}

export const STATUS_COLORS: Record<StatusType, StatusColor> = {
  // ============================================
  // ACTIVE/POSITIVE STATES - Blue/Green Family
  // ============================================

  ongoing: {
    bg: "#EEF2FF",
    text: "#4338CA",
    border: "#6366F1",
    label: "Ongoing",
  },

  completed: {
    bg: "#F0FDF5",
    text: "#047857",
    border: "#10B981",
    label: "Completed",
  },

  upcoming: {
    bg: "#F0F9FF",
    text: "#0369A1",
    border: "#0EA5E9",
    label: "Upcoming",
  },

  accepted: {
    bg: "#F0FDF4",
    text: "#15803D",
    border: "#22C55E",
    label: "Accepted",
  },

  approved: {
    bg: "#F0FDF4",
    text: "#15803D",
    border: "#22C55E",
    label: "Approved",
  },

  verified: {
    bg: "#ECFDF5",
    text: "#047857",
    border: "#10B981",
    label: "Verified",
  },

  confirmed: {
    bg: "#F0FDFA",
    text: "#0F766E",
    border: "#14B8A6",
    label: "Confirmed",
  },

  signed: {
    bg: "#F0FDF4",
    text: "#166534",
    border: "#22C55E",
    label: "Signed",
  },

  allocated: {
    bg: "#EFF6FF",
    text: "#1D4ED8",
    border: "#3B82F6",
    label: "Allocated",
  },

  // ============================================
  // PENDING/WAITING STATES - Amber Family
  // ============================================

  pending: {
    bg: "#FFFBEB",
    text: "#B45309",
    border: "#F59E0B",
    label: "Pending",
  },

  request_off_pending: {
    bg: "#FEF3C7",
    text: "#92400E",
    border: "#F59E0B",
    label: "Request Off Pending",
  },

  // ============================================
  // APPROVED/SUCCESS STATES - Green Family
  // ============================================

  request_off_approved: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#10B981",
    label: "Request Off Approved",
  },

  resolved: {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#10B981",
    label: "Resolved",
  },

  // ============================================
  // REJECTED/NEGATIVE STATES - Red Family
  // ============================================

  rejected: {
    bg: "#FEF2F2",
    text: "#B91C1C",
    border: "#EF4444",
    label: "Rejected",
  },

  request_off_rejected: {
    bg: "#FEE2E2",
    text: "#991B1B",
    border: "#DC2626",
    label: "Request Off Rejected",
  },

  // ============================================
  // COMPLIANCE/VALIDITY STATES
  // ============================================

  attention: {
    bg: "#FEF2F2",
    text: "#B91C1C",
    border: "#EF4444",
    label: "Attention",
  },

  expired: {
    bg: "#FEF2F2",
    text: "#B91C1C",
    border: "#EF4444",
    label: "Expired",
  },

  missing: {
    bg: "#F3F4F6",
    text: "#6B7280",
    border: "#9CA3AF",
    label: "Missing",
  },

  // ============================================
  // CRITICAL/URGENT STATES - Red Family
  // ============================================

  absent: {
    bg: "#FEE2E2",
    text: "#991B1B",
    border: "#DC2626",
    label: "Absent",
  },

  cancelled: {
    bg: "#FFE4E6",
    text: "#9F1239",
    border: "#E11D48",
    label: "Cancelled",
  },

  missed: {
    bg: "#FEF2F2",
    text: "#B91C1C",
    border: "#EF4444",
    label: "Missed",
  },

  order_missed: {
    bg: "#FFF1F2",
    text: "#BE123C",
    border: "#F43F5E",
    label: "Order Missed",
  },

  missed_respond: {
    bg: "#FDF2F8",
    text: "#9D174D",
    border: "#DB2777",
    label: "Missed Response",
  },

  missed_endovertime: {
    bg: "#FFF7ED",
    text: "#9A3412",
    border: "#EA580C",
    label: "Missed End Overtime",
  },

  // ============================================
  // SPECIAL STATES - Purple/Orange Family
  // ============================================

  ended_early: {
    bg: "#F5F3FF",
    text: "#6B21A8",
    border: "#A855F7",
    label: "Ended Early",
  },

  overtime: {
    bg: "#FFF7ED",
    text: "#C2410C",
    border: "#F97316",
    label: "Overtime",
  },

  overtime_started: {
    bg: "#FED7AA",
    text: "#9A3412",
    border: "#EA580C",
    label: "Overtime Started",
  },

  overtime_ended: {
    bg: "#FEF3C7",
    text: "#92400E",
    border: "#D97706",
    label: "Overtime Ended",
  },
};

// Helper function to get status colors
export const getStatusColor = (status: string): StatusColor => {
  if (!status) return STATUS_COLORS.pending;

  // Normalize status string (handle spaces, case, etc.)
  const normalizedStatus = status
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_") as StatusType;

  return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.pending;
};

// Helper function for inline styles
export const getStatusStyle = (status: string) => {
  const colors = getStatusColor(status);
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.border,
  };
};

// Helper to get all statuses by category (useful for filters)
export const getStatusesByCategory = () => {
  return {
    active: ["ongoing", "accepted", "upcoming", "overtime", "overtime_started"],
    completed: ["completed", "overtime_ended", "ended_early"],
    pending: ["pending", "request_off_pending"],
    approved: ["request_off_approved"],
    critical: ["absent", "cancelled", "rejected", "request_off_rejected"],
    missed: ["missed", "order_missed", "missed_respond", "missed_endovertime"],
  };
};

// Helper to check if status is critical (for alerts/notifications)
export const isCriticalStatus = (status: string): boolean => {
  const critical = [
    "absent",
    "cancelled",
    "missed",
    "order_missed",
    "missed_respond",
    "missed_endovertime",
    "rejected",
  ];
  return critical.includes(status?.toLowerCase().replace(/\s+/g, "_"));
};

// Helper to check if status is positive
export const isPositiveStatus = (status: string): boolean => {
  const positive = ["completed", "accepted", "request_off_approved", "ongoing"];
  return positive.includes(status?.toLowerCase().replace(/\s+/g, "_"));
};
