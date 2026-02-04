// src/utils/statusColors.ts

export type StatusType = 
  // Shift/Guard Common Statuses
  | "absent"
  | "pending" 
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "ended_early"
  | "missed"
  | "overtime_started"
  | "overtime_ended"
  | "missed_respond"
  | "missed_endovertime"
  // Guard Specific Statuses
  | "accepted"
  | "rejected"
  | "overtime"
  | "request_off_pending"
  | "request_off_approved"
  | "request_off_rejected"
  // Order Specific Statuses
  | "order_missed";

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
    bg: "#2360FF",
    text: "#FFFFFF",
    border: "#1850CC",
    label: "Ongoing"
  },
  completed: {
    bg: "#10B981",
    text: "#FFFFFF",
    border: "#059669",
    label: "Completed"
  },
  upcoming: {
    bg: "#3B82F6",
    text: "#FFFFFF",
    border: "#2563EB",
    label: "Upcoming"
  },
  accepted: {
    bg: "#22C55E", // Bright green
    text: "#FFFFFF",
    border: "#16A34A",
    label: "Accepted"
  },
  
  // ============================================
  // PENDING/WAITING STATES - Amber/Yellow Family
  // ============================================
  pending: {
    bg: "#F59E0B",
    text: "#FFFFFF",
    border: "#D97706",
    label: "Pending"
  },
  request_off_pending: {
    bg: "#FBBF24", // Lighter amber
    text: "#92400E", // Dark amber text for contrast
    border: "#F59E0B",
    label: "Request Off Pending"
  },
  
  // ============================================
  // APPROVED/SUCCESS STATES - Green Family
  // ============================================
  request_off_approved: {
    bg: "#34D399", // Emerald green
    text: "#FFFFFF",
    border: "#10B981",
    label: "Request Off Approved"
  },
  
  // ============================================
  // REJECTED/NEGATIVE STATES - Red Family
  // ============================================
  rejected: {
    bg: "#EF4444",
    text: "#FFFFFF",
    border: "#DC2626",
    label: "Rejected"
  },
  request_off_rejected: {
    bg: "#F87171", // Light red
    text: "#FFFFFF",
    border: "#EF4444",
    label: "Request Off Rejected"
  },
  
  // ============================================
  // CRITICAL/URGENT STATES - Red Family (Brand Red)
  // ============================================
  absent: {
    bg: "#FC0000",
    text: "#FFFFFF",
    border: "#DC0000",
    label: "Absent"
  },
  cancelled: {
    bg: "#EF4444",
    text: "#FFFFFF",
    border: "#DC2626",
    label: "Cancelled"
  },
  missed: {
    bg: "#DC2626",
    text: "#FFFFFF",
    border: "#B91C1C",
    label: "Missed"
  },
  order_missed: {
    bg: "#B91C1C", // Dark red
    text: "#FFFFFF",
    border: "#991B1B",
    label: "Order Missed"
  },
  missed_respond: {
    bg: "#B91C1C",
    text: "#FFFFFF",
    border: "#991B1B",
    label: "Missed Response"
  },
  missed_endovertime: {
    bg: "#7F1D1D",
    text: "#FFFFFF",
    border: "#991B1B",
    label: "Missed End OT"
  },
  
  // ============================================
  // SPECIAL STATES - Purple/Orange Family
  // ============================================
  ended_early: {
    bg: "#8B5CF6",
    text: "#FFFFFF",
    border: "#7C3AED",
    label: "Ended Early"
  },
  overtime: {
    bg: "#FB923C", // Orange
    text: "#FFFFFF",
    border: "#F97316",
    label: "Overtime"
  },
  overtime_started: {
    bg: "#F97316",
    text: "#FFFFFF",
    border: "#EA580C",
    label: "OT Started"
  },
  overtime_ended: {
    bg: "#FB923C",
    text: "#FFFFFF",
    border: "#F97316",
    label: "OT Ended"
  }
};

// Helper function to get status colors
export const getStatusColor = (status: string): StatusColor => {
  if (!status) return STATUS_COLORS.pending;
  
  // Normalize status string (handle spaces, case, etc.)
  const normalizedStatus = status
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_') as StatusType;
  
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
    active: ['ongoing', 'accepted', 'upcoming', 'overtime', 'overtime_started'],
    completed: ['completed', 'overtime_ended', 'ended_early'],
    pending: ['pending', 'request_off_pending'],
    approved: ['request_off_approved'],
    critical: ['absent', 'cancelled', 'rejected', 'request_off_rejected'],
    missed: ['missed', 'order_missed', 'missed_respond', 'missed_endovertime']
  };
};

// Helper to check if status is critical (for alerts/notifications)
export const isCriticalStatus = (status: string): boolean => {
  const critical = ['absent', 'cancelled', 'missed', 'order_missed', 'missed_respond', 'missed_endovertime', 'rejected'];
  return critical.includes(status?.toLowerCase().replace(/\s+/g, '_'));
};

// Helper to check if status is positive
export const isPositiveStatus = (status: string): boolean => {
  const positive = ['completed', 'accepted', 'request_off_approved', 'ongoing'];
  return positive.includes(status?.toLowerCase().replace(/\s+/g, '_'));
};
