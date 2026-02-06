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
    bg: "#EFF6FF",        // Very light blue
    text: "#1E40AF",      // Deep blue
    border: "#3B82F6",    // Medium blue
    label: "Ongoing"
  },
  completed: {
    bg: "#F0FDF5",        // Very light emerald
    text: "#047857",      // Deep emerald
    border: "#10B981",    // Medium emerald
    label: "Completed"
  },
  upcoming: {
    bg: "#F0F9FF",        // Very light sky blue
    text: "#0369A1",      // Deep sky blue
    border: "#0EA5E9",    // Medium sky blue
    label: "Upcoming"
  },
  accepted: {
    bg: "#F0FDF4",        // Very light green
    text: "#15803D",      // Deep green
    border: "#22C55E",    // Medium green
    label: "Accepted"
  },
  
  // ============================================
  // PENDING/WAITING STATES - Amber Family
  // ============================================
  pending: {
    bg: "#FFFBEB",        // Very light amber
    text: "#B45309",      // Deep amber
    border: "#F59E0B",    // Medium amber
    label: "Pending"
  },
  request_off_pending: {
    bg: "#FEF3C7",        // Light amber
    text: "#92400E",      // Deep amber brown
    border: "#F59E0B",    // Medium amber
    label: "Request Off Pending"
  },
  
  // ============================================
  // APPROVED/SUCCESS STATES - Green Family
  // ============================================
  request_off_approved: {
    bg: "#D1FAE5",        // Light emerald
    text: "#065F46",      // Deep emerald
    border: "#10B981",    // Medium emerald
    label: "Request Off Approved"
  },
  
  // ============================================
  // REJECTED/NEGATIVE STATES - Red Family
  // ============================================
  rejected: {
    bg: "#FEF2F2",        // Very light red
    text: "#B91C1C",      // Deep red
    border: "#EF4444",    // Medium red
    label: "Rejected"
  },
  request_off_rejected: {
    bg: "#FEE2E2",        // Light red
    text: "#991B1B",      // Deep dark red
    border: "#DC2626",    // Medium dark red
    label: "Request Off Rejected"
  },
  
  // ============================================
  // CRITICAL/URGENT STATES - Red Family (Distinct shades)
  // ============================================
  absent: {
    bg: "#FEE2E2",        // Light red
    text: "#7F1D1D",      // Very deep red
    border: "#DC2626",    // Medium dark red
    label: "Absent"
  },
  cancelled: {
    bg: "#FEF2F2",        // Very light red
    text: "#991B1B",      // Deep dark red
    border: "#EF4444",    // Medium red
    label: "Cancelled"
  },
  missed: {
    bg: "#FEE2E2",        // Light red
    text: "#991B1B",      // Deep dark red
    border: "#DC2626",    // Medium dark red
    label: "Missed"
  },
  order_missed: {
    bg: "#FECACA",        // Medium light red
    text: "#7F1D1D",      // Very deep red
    border: "#B91C1C",    // Deep red
    label: "Order Missed"
  },
  missed_respond: {
    bg: "#FEE2E2",        // Light red
    text: "#7F1D1D",      // Very deep red
    border: "#B91C1C",    // Deep red
    label: "Missed Response"
  },
  missed_endovertime: {
    bg: "#FECACA",        // Medium light red
    text: "#7F1D1D",      // Very deep red
    border: "#991B1B",    // Deep dark red
    label: "Missed End Overtime"
  },
  
  // ============================================
  // SPECIAL STATES - Purple/Orange Family
  // ============================================
  ended_early: {
    bg: "#F5F3FF",        // Very light purple
    text: "#6B21A8",      // Deep purple
    border: "#A855F7",    // Medium purple
    label: "Ended Early"
  },
  overtime: {
    bg: "#FFF7ED",        // Very light orange
    text: "#C2410C",      // Deep orange
    border: "#F97316",    // Medium orange
    label: "Overtime"
  },
  overtime_started: {
    bg: "#FFEDD5",        // Light orange
    text: "#9A3412",      // Deep dark orange
    border: "#EA580C",    // Medium dark orange
    label: "Overtime Started"
  },
  overtime_ended: {
    bg: "#FFF7ED",        // Very light orange
    text: "#C2410C",      // Deep orange
    border: "#FB923C",    // Light orange
    label: "Overtime Ended"
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
