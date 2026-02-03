// src/utils/statusColors.ts

export type StatusType = 
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
  | "missed_endovertime";

interface StatusColor {
  bg: string;
  text: string;
  border: string;
  label: string;
}

export const STATUS_COLORS: Record<StatusType, StatusColor> = {
  // Active/Positive - Blue family (matching brand)
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
  
  // Pending - Amber
  pending: {
    bg: "#F59E0B",
    text: "#FFFFFF",
    border: "#D97706",
    label: "Pending"
  },
  
  // Critical/Negative - Red family (matching brand red)
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
    label: "Missed End Overtime"
  },
  
  // Special - Purple/Orange
  ended_early: {
    bg: "#8B5CF6",
    text: "#FFFFFF",
    border: "#7C3AED",
    label: "Ended Early"
  },
  overtime_started: {
    bg: "#F97316",
    text: "#FFFFFF",
    border: "#EA580C",
    label: "Overtime Started"
  },
  overtime_ended: {
    bg: "#FB923C",
    text: "#FFFFFF",
    border: "#F97316",
    label: "Overtime Ended"
  }
};

// Helper function to get status colors
export const getStatusColor = (status: StatusType): StatusColor => {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
};

// Helper function for inline styles
export const getStatusStyle = (status: StatusType) => {
  const colors = getStatusColor(status);
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    borderColor: colors.border,
  };
};

// Helper function for CSS classes (if using Tailwind with arbitrary values)
export const getStatusClasses = (status: StatusType) => {
  const colors = getStatusColor(status);
  return `text-white border-2`;
};
