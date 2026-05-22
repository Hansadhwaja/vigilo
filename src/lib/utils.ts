import { Order } from "@/apis/ordersApi";
import { Schedule } from "@/apis/schedulingAPI";
import { avatarColors, TIMEZONE } from "@/constants";
import { ServicePricingFormValues } from "@/schemas";
import { CalculateGrandTotalProps, OrganizedAssignment, OrganizedShifts, TimeSlot } from "@/types";
import { getStatusColor } from "@/utils/statusColors";
import { clsx, type ClassValue } from "clsx"
import { format, parse } from "date-fns";
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

export const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);


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

export const getCurrentWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day); // Start from Sunday

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    dates.push(currentDay);
  }

  return dates;
};

export const generateWeekDays = (selectedDate: Date) => {
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day); // Start from Sunday

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    days.push(currentDay);
  }

  return days;
};

export const toLocalTime = (isoString: string | number | Date) => new Date(isoString);

export const getTimeHHMM = (dateObj: Date) => dateObj.toTimeString().slice(0, 5);

export const getDuration = (
  start: string | number | Date,
  end: string | number | Date,
) => {
  const diff =
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
  return `${diff} hours`;
};

export const organizeShifts = (
  scheduleList: Schedule[],
  timeSlots: TimeSlot[]
): OrganizedShifts => {
  const organized: OrganizedShifts = {};

  const toMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(":").map(Number);

    return h * 60 + m;
  };

  scheduleList.forEach((shift) => {
    /* ---------------- LOCAL DATES ---------------- */

    const startDateObj = new Date(
      shift.startTime
    );

    const endDateObj = new Date(
      shift.endTime
    );

    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    /* ---------------- LOCAL TIMES ---------------- */

    const start = toLocalTime(
      shift.startTime
    );

    const end = toLocalTime(
      shift.endTime
    );

    /* ---------------- DAYS DIFF ---------------- */

    const daysDiff = Math.floor(
      (endDateObj.getTime() -
        startDateObj.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    /* ---------------- SLOT MATCH ---------------- */

    const shiftStartHHMM =
      getTimeHHMM(start);

    const shiftStartMin =
      toMinutes(shiftStartHHMM);

    let matchedSlot: string | null =
      null;

    for (
      let i = 0;
      i < timeSlots.length;
      i++
    ) {
      const curr = toMinutes(
        timeSlots[i].time
      );

      const next =
        i < timeSlots.length - 1
          ? toMinutes(
            timeSlots[i + 1].time
          )
          : 9999;

      if (
        shiftStartMin >= curr &&
        shiftStartMin < next
      ) {
        matchedSlot =
          timeSlots[i].time;

        break;
      }
    }

    if (!matchedSlot) return;

    /* ---------------- LOOP DAYS ---------------- */

    for (
      let dayOffset = 0;
      dayOffset <= daysDiff;
      dayOffset++
    ) {
      const currentDateObj =
        new Date(startDateObj);

      currentDateObj.setDate(
        currentDateObj.getDate() +
        dayOffset
      );

      const dateKey =
        formatDateKey(currentDateObj);

      if (!organized[dateKey]) {
        organized[dateKey] = {};
      }

      if (
        !organized[dateKey][matchedSlot]
      ) {
        organized[dateKey][
          matchedSlot
        ] = [];
      }

      /* ---------------- ASSIGNMENTS ---------------- */

      shift.guards.forEach((guard) => {
        const assignment: OrganizedAssignment =
        {
          shiftId: shift.id,

          guardId: guard.id,

          id: `${shift.id}-${guard.id}-${dateKey}`,

          guardName: guard.name,

          guardEmail: guard.email,

          guardStatus:
            guard.StaticGuards
              ?.status ||
            shift.status,

          orderId: shift.orderId,

          orderLocationName:
            shift.orderLocationName ||
            "Unknown Location",

          orderName:
            shift.orderLocationName ||
            "Unknown Location",

          orderAddress:
            shift.orderLocationAddress ||
            "Address not available",

          description:
            shift.description,

          type: shift.type,

          status: shift.status,

          statusColors:
            getStatusColor(
              shift.status
            ),

          timeSlot: matchedSlot,

          start:
            start.toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          end:
            end.toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          duration: getDuration(
            shift.startTime,
            shift.endTime
          ),

          displayDate: dateKey,

          originalStartDate:
            shift.startTime,

          originalEndDate:
            shift.endTime,

          allGuardIdsForShift:
            shift.guards.map(
              (g) => g.id
            ),
        };

        organized[dateKey][
          matchedSlot
        ].push(assignment);
      });
    }
  });

  return organized;
};

export const formatDateStr = (iso: string | Date) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTimeStr = (iso: string | Date) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatHourShort = (iso: string | Date) => {
  // e.g. "02:30 PM" — used where only start time required
  return formatTimeStr(iso);
};

export const combineDateAndTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":");
  const newDate = new Date(date);
  newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return newDate.toISOString();
};

export const calculateGrandTotal = ({
  orders = [],
  alarms = [],
  services = [],
  serviceData,
}: CalculateGrandTotalProps): number => {
  let total = 0;

  // Orders
  for (const o of orders) {
    const service = serviceData?.[o.title];
    if (!service) continue;

    const price =
      service.priceType === "daily"
        ? service.dailyPrice
        : service.hourlyPrice;

    const duration =
      service.priceType === "daily" ? o.days : o.hours;

    total += (duration || 0) * Number(price || 0);
  }

  // Alarms
  for (const a of alarms) {
    total += Number(a.price || 0);
  }

  // Services
  for (const s of services) {
    total += (s.days || 0) * (s.price || 0);
  }

  return total;
};

export const getOrderPricing = (o: Order, serviceData: Record<string, ServicePricingFormValues>) => {
  const service = serviceData?.[o.serviceType];
  if (!service) return null;

  const { hours, days } = calculateWork(
    o.startDate,
    o.startTime,
    o.endDate,
    o.endTime
  );

  const price =
    service.priceType === "daily"
      ? service.dailyPrice
      : service.hourlyPrice;

  const durationValue =
    service.priceType === "daily" ? days : hours;

  return {
    price,
    duration: service.priceType === "daily"
      ? `${days} days`
      : `${hours} hrs`,
    total: (durationValue || 0) * Number(price || 0),
    hours,
    days
  };
};

export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

export const mapAssignmentToForm = (a: OrganizedAssignment) => {
  if (!a) return undefined;

  return {
    description: a.description || "",

    // ✅ Date (YYYY-MM-DD)
    startDate: a.originalStartDate
      ? new Date(a.originalStartDate).toISOString().split("T")[0]
      : "",

    endDate: a.originalEndDate
      ? new Date(a.originalEndDate).toISOString().split("T")[0]
      : "",

    orderId: a.orderId || "",

    // ✅ Multi guards
    guardIds: a?.allGuardIdsForShift || [],

    // ✅ Time (HH:mm)
    startTime: convertTo24Hour(a.start),

    endTime: convertTo24Hour(a.end),
  };
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
};

export const formatTimeForInput = (date: string) => {
  const d = new Date(date);

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const convertTo24Hour = (time: string) => {
  const [timePart, modifier] = time.split(" ");

  let [hours, minutes] = timePart.split(":");

  const mod = modifier.toLowerCase();

  if (mod === "am" && hours === "12") {
    hours = "00";
  }

  if (mod === "pm" && hours !== "12") {
    hours = String(Number(hours) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
};

export const combineDateAnd12HourTime = (
  date: string,
  time: string
) => {

  // "09 May 2026"
  const parsedDate = parse(
    date,
    "dd MMM yyyy",
    new Date()
  );

  // "13:16"
  const parsedTime = parse(
    time,
    "HH:mm",
    new Date()
  );

  parsedDate.setHours(
    parsedTime.getHours(),
    parsedTime.getMinutes(),
    0,
    0
  );

  return format(
    parsedDate,
    "yyyy-MM-dd'T'HH:mm:ssxxx"
  );
};

export const customFormatDateTime = (iso?: string) => {
  if (!iso) return { date: "—", time: "—" };
  try {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  } catch {
    return { date: iso, time: "—" };
  }
};

export const checkSLABreach = (alarm: any) => {
  if (!alarm.slaTargetMins || alarm.completed) return null;

  const breachPercentage = (alarm.sinceMins / alarm.slaTargetMins) * 100;

  if (breachPercentage >= 100) {
    return {
      level: "CRITICAL_BREACH",
      message: `SLA CRITICAL BREACH: ${alarm.sinceMins - alarm.slaTargetMins} minutes overdue`,
      action: "ESCALATE_TO_MANAGEMENT"
    };
  } else if (breachPercentage >= 90) {
    return {
      level: "WARNING",
      message: `SLA WARNING: ${Math.round(breachPercentage)}% of SLA time elapsed`,
      action: "NOTIFY_SUPERVISOR"
    };
  } else if (breachPercentage >= 75) {
    return {
      level: "CAUTION",
      message: `SLA CAUTION: ${Math.round(breachPercentage)}% of SLA time elapsed`,
      action: "PRIORITY_ASSIGNMENT"
    };
  }

  return null;
};

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};