import { avatarColors } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const resolveUserId = (row: any): string | number | null => {
  if (!row || typeof row !== "object") return null;
  if (row.userId !== undefined && row.userId !== null && String(row.userId).trim()) return row.userId;
  if (row.id !== undefined && row.id !== null && String(row.id).trim()) return row.id;
  if (row._id !== undefined && row._id !== null && String(row._id).trim()) return row._id;
  return null;
};

export const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

export const fileToDataUrl = (file: File) => new Promise<string>((res, rej) => {
  const reader = new FileReader();
  reader.onload = () => res(String(reader.result || ""));
  reader.onerror = () => rej(new Error("Failed to read file"));
  reader.readAsDataURL(file);
});

export const formatPresence = (isOnline: boolean, lastSeenAt: string | null) => {
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

export const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const getDateTime = ({
  date,
  time,
}: {
  date: string;
  time: string;
}) => {
  const d = new Date(date);

  // Extract UTC parts to avoid timezone shift
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  const [hours, minutes] = time.split(":").map(Number);

  // Create LOCAL datetime using extracted date
  return new Date(year, month, day, hours, minutes);
};

export const calculateWork = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) => {
  const start = getDateTime({ date: startDate, time: startTime });
  const end = getDateTime({ date: endDate, time: endTime });

  let diffMs = end.getTime() - start.getTime();

  // 🔥 Handle overnight shifts (VERY IMPORTANT)
  if (diffMs < 0) {
    const nextDay = new Date(end);
    nextDay.setDate(nextDay.getDate() + 1);
    diffMs = nextDay.getTime() - start.getTime();
  }

  const totalHours = diffMs / (1000 * 60 * 60);

  return {
    hours: Number(totalHours.toFixed(2)),
    days: Math.floor(totalHours / 24),
  };
};

export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(d);
};