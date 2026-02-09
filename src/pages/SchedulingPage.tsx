import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Bell,
  Repeat,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { useGetAllGuardsQuery } from "../apis/guardsApi";
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetAllSchedulesQuery,
} from "../apis/schedulingAPI";
import { useGetAllOrdersQuery } from "../apis/ordersApi";
import { toast } from "sonner";
import { getStatusColor, getStatusStyle } from "../utils/statusColors";
import { DatePicker } from "@heroui/react";
import EditAssignmentDialog from "../components/ui/EditAssignmentDialog";

// Helper to get current week dates
const getCurrentWeekDates = () => {
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
const currentWeek = getCurrentWeekDates();

const upcomingReminders = [
  {
    id: "REM-001",
    type: "Shift Start",
    message: "Night shift starting in 30 minutes",
    time: new Date().toISOString(),
    assignee: "Lisa Rodriguez",
  },
  {
    id: "REM-002",
    type: "Patrol Assignment",
    message: "Vehicle patrol assignment due",
    time: new Date(Date.now() + 3600000).toISOString(),
    assignee: "Mike Chen",
  },
];
// Convert to Local Date object
const toLocalTime = (isoString: string | number | Date) => new Date(isoString);

// HH:MM formatter
const getTimeHHMM = (dateObj: Date) => dateObj.toTimeString().slice(0, 5);

// Duration
const getDuration = (
  start: string | number | Date,
  end: string | number | Date,
) => {
  const diff =
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
  return `${diff} hours`;
};

export const organizeShifts = (scheduleList: any[], timeSlots: any[]) => {
  const organized: { [key: string]: any } = {};

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  scheduleList.forEach((shift) => {
    // ✅ FIX: Extract dates from startTime and endTime ISO strings
    const startDateStr = shift.startTime.split('T')[0];  // "2026-01-29"
    const endDateStr = shift.endTime.split('T')[0];      // "2026-01-31"
    // For time display, use toLocalTime
    const start = toLocalTime(shift.startTime);
    const end = toLocalTime(shift.endTime);

    // Parse dates properly
    const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
    
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);
    
    const daysDiff = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));


    // ✅ Loop through each day (inclusive)
    for (let dayOffset = 0; dayOffset <= daysDiff; dayOffset++) {
      const currentDateObj = new Date(startDateObj);
      currentDateObj.setDate(startDateObj.getDate() + dayOffset);
      
      // Format date manually (avoid timezone issues)
      const year = currentDateObj.getFullYear();
      const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(currentDateObj.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;


      // Use LOCAL TIME for comparison
      const shiftStartHHMM = getTimeHHMM(start);
      const shiftStartMin = toMinutes(shiftStartHHMM);

      // Find matching slot
      let matchedSlot: string | null = null;

      for (let i = 0; i < timeSlots.length; i++) {
        const curr = toMinutes(timeSlots[i].time);
        const next =
          i < timeSlots.length - 1 ? toMinutes(timeSlots[i + 1].time) : 9999;

        if (shiftStartMin >= curr && shiftStartMin < next) {
          matchedSlot = timeSlots[i].time;
          break;
        }
      }

      if (!matchedSlot) {
        console.log(`    ❌ No matching slot for ${shiftStartHHMM}`);
        continue;
      }

      if (!organized[dateKey]) organized[dateKey] = {};
      if (!organized[dateKey][matchedSlot]) organized[dateKey][matchedSlot] = [];

      // Add guard-based assignments for this day
      shift.guards.forEach((guard: any) => {
        organized[dateKey][matchedSlot].push({
          shiftId: shift.id,
          guardId: guard.id,
          id: `${shift.id}-${guard.id}-${dateKey}`,

          guardName: guard.name,
          guardEmail: guard.email,
          guardStatus: guard.StaticGuards?.status || shift.status,

          orderId: shift.orderId,
          orderLocationName: shift.locationName || "Unknown Location",
          orderName: shift.orderName || "Unknown Location",
           orderAddress: shift.orderAddress || "Address not available",

          description: shift.description,
          type: shift.type,
          status: shift.status,

          statusColors: getStatusColor(shift.status),

          timeSlot: matchedSlot,
          start,
          end,
          duration: getDuration(shift.startTime, shift.endTime),
          
          displayDate: dateKey,
          originalStartDate: shift.startTime,
          originalEndDate: shift.endTime,
          allGuardIdsForShift: shift.guards.map((g: any) => g.id),
        });
      });
    }

  });

  return organized;
};








export default function ShiftPage() {
  const today = new Date();
  // const [scheduleData, setScheduleData] = useState(sampleScheduleData);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [reminders] = useState(upcomingReminders);
  const [guardsOpen, setGuardsOpen] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);

  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 100000000;
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [filterOrder, setFilterOrder] = useState("all");
  const [filterGuard, setFilterGuard] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: guardsData } = useGetAllGuardsQuery({ page: 1, limit: 1000 });
  const { data: ordersData } = useGetAllOrdersQuery({ page: 1, limit: 1000 });

  //delete a schedule
  const [deleteSchedule] = useDeleteScheduleMutation();
  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();

    try {
      // Show confirmation toast with action buttons
      toast.custom((t) => (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex-1">
            <div className="font-semibold text-red-900">Delete Schedule?</div>
            <div className="text-sm text-red-700 mt-1">
              This action cannot be undone.
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const res = await deleteSchedule({ id }).unwrap();
                  if (res.success) {
                    toast.success("Schedule deleted successfully");
                  } else {
                    toast.error(res.message || "Failed to delete schedule");
                  }
                } catch (error) {
                  toast.error("Failed to delete schedule");
                }
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  // In your calendar/scheduling component where you call handleOpenEditDialog

const handleOpenEditDialog = (assignment: any) => {
  const shiftId = assignment.shiftId;
  
  // Find all assignments with the same shiftId
  const allAssignmentsForShift = scheduleData
    .flatMap(day => day.guards)
    .filter(a => a.shiftId === shiftId);
  
  // ✅ Extract unique guard IDs (remove duplicates)
  const allGuardIds = [...new Set(allAssignmentsForShift.map(a => a.guardId))];
  
  console.log("All guard IDs for shift:", allGuardIds); // ✅ Debug log
  
  setSelectedAssignment({
    ...assignment,
    allGuardIdsForShift: allGuardIds, // ✅ No duplicates
  });
  
  setShowEditDialog(true);
};


  // Helpers: timezone constants & formatters
  const TIMEZONE = "Asia/Kolkata";

  const formatDateStr = (iso: string | Date) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeStr = (iso: string | Date) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatHourShort = (iso: string | Date) => {
    // e.g. "02:30 PM" — used where only start time required
    return formatTimeStr(iso);
  };

  const [createSchedule, { isLoading: isCreating }] =
    useCreateScheduleMutation();

  // Convert JS Date + Time to ISO or backend-friendly "YYYY-MM-DD HH:mm"
  const combineDateAndTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return newDate.toISOString();
  };

  const handleCreateSchedule = async () => {
    try {
      // --- FIX: ensure date is converted to JS Date ---
      const jsDate = new Date(formData.date);

      if (isNaN(jsDate.getTime())) {
        console.error("Invalid date:", formData.date);
        toast.error("Invalid date");
        return;
      }

      const payload = {
        description: formData.description,
        date: formData.date, // ✅ Already "YYYY-MM-DD" format
        endDate: formData.endDate, // ✅ Already "YYYY-MM-DD" format
        orderId: formData.orderId,
        guardIds: formData.guardIds,
        startTime: formData.startTime, // already HH:mm format or ISO — OK
        endTime: formData.endTime,
      };

      console.log("Sending payload:", payload);

      const res = await createSchedule(payload).unwrap();

      toast.success("Schedule created successfully!");
      setShowCreateDialog(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create schedule");
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    endDate: "",
    startTime: "",
    endTime: "",
    guardIds: [] as string[],
    orderId: "",
    role: "",
    recurring: "none",
    limit: 1000000,
  });

  const { data: schedulingResponse } = useGetAllSchedulesQuery();

  // Extract schedule data from API response
  const schedule = schedulingResponse?.data || [];
  //  console.log("Fetched Schedules:", schedule);

  // Time slots for the scheduler
  const timeSlots = [
    { time: "06:00", label: "6 am" },
    { time: "08:00", label: "8 am" },
    { time: "10:00", label: "10 am" },
    { time: "12:00", label: "12 pm" },
    { time: "14:00", label: "2 pm" },
    { time: "16:00", label: "4 pm" },
    { time: "18:00", label: "6 pm" },
    { time: "20:00", label: "8 pm" },
    { time: "22:00", label: "10 pm" },
    { time: "00:00", label: "12 am" },
    { time: "02:00", label: "2 am" },
    { time: "04:00", label: "4 am" },
  ];

  const organizedShifts = useMemo(() => {
    return organizeShifts(schedule, timeSlots);
  }, [schedule, timeSlots]);

  const getAssignmentsForSlotFromOrganized = (
    day: { toISOString: () => string },
    time: string | number,
  ) => {
    const dateKey = day.toISOString().split("T")[0];
    return organizedShifts[dateKey]?.[time] || [];
  };

  const formatShiftTime = (
    start: {
      toLocaleTimeString: (
        arg0: never[],
        arg1: { hour: string; minute: string },
      ) => any;
    },
    end: {
      toLocaleTimeString: (
        arg0: never[],
        arg1: { hour: string; minute: string },
      ) => any;
    },
  ) => {
    return `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page only when search changes, not on mount
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]); // Removed currentPage from dependencies

  // Fetch guards from API with pagination and search
  const {
    data: guardsResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetAllGuardsQuery(
    {
      limit: itemsPerPage,
      page: currentPage,
      search: debouncedSearch || undefined,
    },
    {
      // Refetch when any parameter changes
      refetchOnMountOrArgChange: true,
    },
  );

  // Extract guards data from API response
  const guards = guardsResponse?.data || [];

  //fetch orders from API
  const { data: ordersResponse } = useGetAllOrdersQuery();
  const orders = ordersResponse?.data || [];

  const scheduleData = useMemo(() => {
    // `schedule` is API response array (from useGetAllSchedulesQuery)
    // if schedule is undefined, return empty
    const arr = (schedule || []).map((item) => {
      // item.startTime, item.endTime are ISO UTC strings in API
      const startDateObj = new Date(item.startTime);
      const endDateObj = new Date(item.endTime);

      // Normalize end crossing midnight: if end < start, add 1 day to end
      let correctedEnd = new Date(endDateObj);
      if (correctedEnd < startDateObj) {
        correctedEnd = new Date(correctedEnd.getTime() + 24 * 60 * 60 * 1000);
      }

      // build guard-assignment objects (one per guard). Each assignment will include:
      // id (unique), name, email, orderId, description, role (if available), time string, status, StaticGuards
      const guards = (item.guards || []).map((g) => {
        const assignmentStart = startDateObj;
        const assignmentEnd = correctedEnd;
        const timeStr = `${formatTimeStr(assignmentStart)} - ${formatTimeStr(assignmentEnd)}`;

        // unique id for the assignment: combine shift id + guard id
        const assignmentId = `${item.id}-${g.id}`;

        return {
          id: assignmentId,
          guardId: g.id,
          name: g.name,
          email: g.email,
          orderId: item.orderId,
          description: item.description || "",
          role: g.role || "Guard", // fallback
          time: timeStr,
          timeStart: assignmentStart, // Date object (local conversion will depend on display)
          timeEnd: assignmentEnd,
          status: g.StaticGuards?.status || item.status || "pending", // prefer guard assignment status
          StaticGuards: g.StaticGuards || null,
          shiftId: item.id,
          rawStartISO: item.startTime,
          rawEndISO: item.endTime,
        };
      });

      return {
        id: item.id,
        orderId: item.orderId,
        date: new Date(item.startTime), // used for grouping by day
        dateString: formatDateStr(item.startTime), // e.g. "Dec 05, 2025"
        start: new Date(item.startTime),
        end: correctedEnd,
        startFormatted: formatTimeStr(item.startTime),
        endFormatted: formatTimeStr(correctedEnd),
        shiftDuration: (() => {
          const hours =
            (correctedEnd.getTime() - startDateObj.getTime()) /
            (1000 * 60 * 60);
          return `${Number(hours.toFixed(1))} hours`;
        })(),
        guards,
        original: item, // keep full original if you want
      };
    });

    // If you want scheduleData grouped by date (one object per date with guards flattened),
    // convert array of shifts into days:
    const groupedByDay: { [key: string]: any } = {};
    for (const shift of arr) {
      const dateKey = shift.date.toDateString();
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = {
          date: shift.date,
          dateString: shift.dateString,
          guards: [],
        };
      }
      // push every guard assignment for this shift into that day's guards
      groupedByDay[dateKey].guards.push(...shift.guards);
    }

    // return as array sorted by date ascending
    return Object.values(groupedByDay).sort(
      (a: any, b: any) => a.date.getTime() - b.date.getTime(),
    );
  }, [schedule]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const allAssignments = scheduleData.flatMap((s) => s.guards);
    const todayAssignments =
      scheduleData.find((s) => s.date.toDateString() === today.toDateString())
        ?.guards || [];

    return {
      activeShifts: todayAssignments.filter(
        (g: { StaticGuards: { status: string } }) =>
          g.StaticGuards?.status === "active",
      ).length,
      scheduledToday: todayAssignments.length,
      totalThisWeek: allAssignments.length,
      patrolsActive: allAssignments.filter(
        (g) => g.role === "Patrol" && g.StaticGuards?.status === "active",
      ).length,
    };
  }, [scheduleData, today]);

  // Get assignments for selected date with filters
  const getFilteredAssignments = (date: Date) => {
    const dayData = scheduleData.find(
      (day) => day.date.toDateString() === date.toDateString(),
    );
    if (!dayData) return [];

    return dayData.guards.filter(
      (assignment: {
        orderId: string;
        guardId: string;
        id: string;
        role: any;
        name: any;
        description: any;
      }) => {
        const matchesOrder =
          filterOrder === "all" || assignment.orderId === filterOrder;
        const matchesGuard =
          filterGuard === "all" ||
          assignment.guardId === filterGuard ||
          assignment.id === filterGuard;
        const matchesRole =
          filterRole === "all" ||
          (assignment.role || "").toLowerCase() === filterRole.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          (assignment.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (assignment.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesOrder && matchesGuard && matchesRole && matchesSearch;
      },
    );
  };

  // Get all assignments for calendar view
  const getDateAssignments = (date: Date) => {
    const dayData = scheduleData.find(
      (day) => day.date.toDateString() === date.toDateString(),
    );
    return dayData?.guards || [];
  };

  // Check if date has assignments
  const hasAssignments = (date: Date) => {
    return getDateAssignments(date).length > 0;
  };

  const handleCreateAssignment = () => {
    setFormData({
      description: "",
      date: "",
      endDate: "",
      startTime: "",
      endTime: "",
      guardIds: [],
      orderId: "",
      role: "",
      recurring: "none",
      limit: 1000000,
    });
    setShowCreateDialog(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setFormData({
      description: assignment.description || "",
      date: "",
      endDate: "",
      startTime: assignment.time.split("-")[0],
      endTime: assignment.time.split("-")[1],
      guardIds: [assignment.id],
      orderId: assignment.orderId,
      role: assignment.role,
      recurring: "none",
      limit: 1000000,
    });
    setShowEditDialog(true);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Generate weekly view days
  const generateWeekDays = () => {
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

  const weekDays = generateWeekDays();

  // Helper function to get assignments for a specific day and time
  const getAssignmentsForSlot = (date: Date, timeSlot: string) => {
    const dayData = scheduleData.find(
      (day) => new Date(day.date).toDateString() === date.toDateString(),
    );

    if (!dayData) return [];

    return dayData.guards.filter((assignment: any) => {
      //  backend returns ISO strings:
      // "startTime": "2025-11-28T11:25:00.000Z"
      const assignmentStart = new Date(
        assignment.rawStartISO,
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return assignmentStart === timeSlot;
    });
  };

  // Navigation helpers
  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
    setCurrentMonth(newDate);
  };
  // useEffect(() => {
  //   console.log("Selected Guards:", formData.guardIds);
  // }, [formData.guardIds]);

  return (
    <div className="space-y-3">
      {/* Compact Header with Summary Cards Inline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">Scheduling Calendar</h1>
          <p className="text-gray-600 text-lg">
            Managed Assignment & Calendar View
          </p>
        </div>

        {/* Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">
                {metrics.activeShifts}
              </div>
              <div className="text-lg text-green-600">Active Now</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">
                {metrics.scheduledToday}
              </div>
              <div className="text-lg text-blue-600">Today</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <User className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">
                {metrics.totalThisWeek}
              </div>
              <div className="text-lg text-purple-600">This Week</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <MapPin className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">
                {metrics.patrolsActive}
              </div>
              <div className="text-lg text-orange-600">Patrols</div>
            </div>
          </div>

          <Button
            onClick={handleCreateAssignment}
            className="flex items-center gap-2 ml-2"
          >
            <Plus className="h-4 w-4" />
            Assign Guard
          </Button>
        </div>
      </div>

      {/* Compact Filters and Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        {/* Compact Filters */}
        <div className="flex flex-wrap gap-2 items-center w-full p-3 rounded-lg border">
          <Filter className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-auto h-8"
          />
          <Select value={filterOrder} onValueChange={setFilterOrder}>
            <SelectTrigger className="w-auto h-8">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.locationAddress}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGuard} onValueChange={setFilterGuard}>
            <SelectTrigger className="w-auto h-8">
              <SelectValue placeholder="Guard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guards</SelectItem>
              {guards.map((guard) => (
                <SelectItem key={guard.id} value={guard.id}>
                  {guard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-auto h-8">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="static">Static Guard</SelectItem>
              <SelectItem value="patrol">Patrol Guard</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterOrder("all");
              setFilterGuard("all");
              setFilterRole("all");
              setSearchTerm("");
            }}
            className="h-8"
          >
            Clear
          </Button>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("weekly")}
          >
            Weekly View
          </Button>
          <Button
            variant={viewMode === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("daily")}
          >
            Daily Timeline
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAlertsDialog(true)}
          >
            <Bell className="h-4 w-4 mr-1" />
            Alerts ({reminders.length})
          </Button>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="space-y-3">
        {/* DAILY TIMELINE VIEW */}
        {viewMode === "daily" && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Daily Schedule Timeline
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(new Date());
                      setCurrentMonth(new Date());
                    }}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 h-8 px-3"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-lg">
                      <span className="font-bold text-blue-900">
                        {getFilteredAssignments(selectedDate).length}
                      </span>
                      <span className="text-gray-600 ml-1">Total Shifts</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-lg">
                      <span className="font-bold text-orange-900">
                        {
                          getFilteredAssignments(selectedDate).filter(
                            (a: { role: string }) => a.role === "Patrol",
                          ).length
                        }
                      </span>
                      <span className="text-gray-600 ml-1">Patrol</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-lg">
                      <span className="font-bold text-green-900">
                        {
                          getFilteredAssignments(selectedDate).filter(
                            (a: { role: string }) => a.role === "static",
                          ).length
                        }
                      </span>
                      <span className="text-gray-600 ml-1">Static</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-lg">
                      <span className="font-bold text-purple-900">
                        {
                          new Set(
                            getFilteredAssignments(selectedDate).map(
                              (a: { orderId: any }) => a.orderId,
                            ),
                          ).size
                        }
                      </span>
                      <span className="text-gray-600 ml-1">Orders</span>
                    </span>
                  </div>
                </div>

                {/* All Shifts Displayed as Cards */}
                {getFilteredAssignments(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {Array.from(
                      new Set(
                        getFilteredAssignments(selectedDate).map(
                          (a: { time: string }) => a.time.split("-")[0],
                        ),
                      ),
                    )
                      .sort()
                      .map((startTime: unknown) => {
                        const timeStr = String(startTime);
                        const shiftsAtTime = getFilteredAssignments(
                          selectedDate,
                        ).filter(
                          (a: { time: string }) =>
                            a.time.split("-")[0] === timeStr,
                        );

                        return (
                          <div key={timeStr} className="space-y-2">
                            <div className="flex items-center gap-2 px-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-700">
                                {timeStr}
                              </span>
                              <div className="flex-1 h-px bg-gray-300"></div>
                              <span className="text-lg text-gray-500">
                                {shiftsAtTime.length} shift
                                {shiftsAtTime.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {shiftsAtTime.map(
                                (
                                  assignment: {
                                    shiftId: string;

                                    id: string;
                                    role: string;
                                    name:
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | React.ReactElement<
                                          unknown,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | Promise<
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | React.ReactPortal
                                          | React.ReactElement<
                                              unknown,
                                              | string
                                              | React.JSXElementConstructor<any>
                                            >
                                          | Iterable<React.ReactNode>
                                          | null
                                          | undefined
                                        >
                                      | null
                                      | undefined;
                                    time:
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | React.ReactElement<
                                          unknown,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | Promise<
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | React.ReactPortal
                                          | React.ReactElement<
                                              unknown,
                                              | string
                                              | React.JSXElementConstructor<any>
                                            >
                                          | Iterable<React.ReactNode>
                                          | null
                                          | undefined
                                        >
                                      | null
                                      | undefined;
                                    description:
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | React.ReactElement<
                                          unknown,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | Promise<
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | React.ReactPortal
                                          | React.ReactElement<
                                              unknown,
                                              | string
                                              | React.JSXElementConstructor<any>
                                            >
                                          | Iterable<React.ReactNode>
                                          | null
                                          | undefined
                                        >
                                      | null
                                      | undefined;
                                    orderId: string;
                                    StaticGuards: { status: string };
                                    status: any;
                                  },
                                  idx: React.Key | null | undefined,
                                ) => (
                                  <div
                                    key={assignment.id}
                                    className={`
                                  relative p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer
                                  ${
                                    assignment.role === "Patrol"
                                      ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:border-orange-400"
                                      : "bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400"
                                  }
                                `}
                                    onClick={() =>
                                      handleEditAssignment(assignment)
                                    }
                                  >
                                    <div className="absolute top-2 right-2">
                                      <Badge
                                        variant="outline"
                                        className={`
                                      text-lg px-2 py-0.5
                                      ${
                                        assignment.role === "patrol"
                                          ? "bg-orange-200 text-orange-900 border-orange-400"
                                          : "bg-green-200 text-green-900 border-green-400"
                                      }
                                    `}
                                      >
                                        {assignment.role}
                                      </Badge>
                                    </div>

                                    <div className="space-y-3 pr-16">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <User className="h-5 w-5 text-gray-700" />
                                          <span className="font-bold text-gray-900">
                                            {assignment.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-lg text-gray-700">
                                          <Clock className="h-4 w-4" />
                                          <span className="font-medium">
                                            {assignment.time}
                                          </span>
                                        </div>
                                      </div>

                                      {assignment.description && (
                                        <div className="text-lg text-gray-700 pt-2 border-t border-gray-300">
                                          {assignment.description}
                                        </div>
                                      )}

                                      <div className="space-y-1 pt-2 border-t border-gray-300">
                                        <div className="flex items-start gap-2">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1 mt-1">
                                              <div
                                                className={`
                                            px-2 py-0.5 rounded-full text-lg font-medium
                                            ${
                                              assignment.orderId === "o1"
                                                ? "bg-blue-200 text-blue-900"
                                                : assignment.orderId === "o2"
                                                  ? "bg-purple-200 text-purple-900"
                                                  : assignment.orderId === "o3"
                                                    ? "bg-cyan-200 text-cyan-900"
                                                    : assignment.orderId ===
                                                        "o4"
                                                      ? "bg-amber-200 text-amber-900"
                                                      : assignment.orderId ===
                                                          "o5"
                                                        ? "bg-pink-200 text-pink-900"
                                                        : "bg-teal-200 text-teal-900"
                                            }
                                          `}
                                              >
                                                {assignment.description}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-2">
                                        <Badge
                                          variant="outline"
                                          className="text-lg border-2"
                                          style={getStatusStyle(
                                            assignment.status,
                                          )}
                                        >
                                          {
                                            getStatusColor(assignment.status)
                                              .label
                                          }
                                        </Badge>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                                            onClick={(e: any) =>
                                              handleDelete(
                                                assignment.shiftId,
                                                e,
                                              )
                                            }
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">
                      No Shifts Scheduled
                    </h3>
                    <p className="text-lg text-gray-500 mb-4">
                      No guard assignments for this date
                    </p>
                    <Button onClick={handleCreateAssignment} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                )}

                {/* Order Legend */}
                {getFilteredAssignments(selectedDate).length > 0 && (
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="text-lg font-medium text-gray-600 mb-2">
                      ORDER LEGEND
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(
                          getFilteredAssignments(selectedDate).map(
                            (a: { orderId: any }) => a.orderId,
                          ),
                        ),
                      ).map((orderId) => {
                        const assignment = getFilteredAssignments(
                          selectedDate,
                        ).find(
                          (a: { orderId: unknown }) => a.orderId === orderId,
                        );
                        return (
                          <div
                            key={orderId as string}
                            className={`
                              px-3 py-1 rounded-full text-lg font-medium
                              ${
                                orderId === "o1"
                                  ? "bg-blue-200 text-blue-900"
                                  : orderId === "o2"
                                    ? "bg-purple-200 text-purple-900"
                                    : orderId === "o3"
                                      ? "bg-cyan-200 text-cyan-900"
                                      : orderId === "o4"
                                        ? "bg-amber-200 text-amber-900"
                                        : orderId === "o5"
                                          ? "bg-pink-200 text-pink-900"
                                          : "bg-teal-200 text-teal-900"
                              }
                            `}
                          >
                            {assignment?.description || orderId}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* WEEKLY CALENDAR VIEW */}
        {viewMode === "weekly" && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Weekly Schedule
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    {weekDays[0].toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {weekDays[6].toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek(-1)}
                    className="hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(new Date());
                      setCurrentMonth(new Date());
                    }}
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 h-8 px-3"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek(1)}
                    className="hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-8 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="p-3 border-r border-gray-200 font-semibold text-gray-700 text-lg">
                    TIME
                  </div>
                  {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === today.toDateString();
                    const isSelected =
                      day.toDateString() === selectedDate.toDateString();
                    const dayName = day
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase();
                    const monthName = day.toLocaleDateString("en-US", {
                      month: "short",
                    });

                    return (
                      <div
                        key={index}
                        className={`
                  p-3 border-r border-gray-200 text-center cursor-pointer transition-all
                  ${
                    isSelected
                      ? "bg-blue-900 text-white"
                      : isToday
                        ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                        : "hover:bg-gray-200"
                  }
                `}
                        onClick={() => setSelectedDate(new Date(day))}
                      >
                        <div className="font-semibold text-lg">{dayName}</div>
                        <div
                          className={`text-lg font-bold ${isSelected ? "text-white" : isToday ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {day.getDate()}
                        </div>
                        <div
                          className={`text-lg ${isSelected ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {monthName}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="grid grid-cols-8 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="p-3 border-r border-gray-200 bg-gray-50">
                      <div className="font-semibold text-gray-900 text-lg">
                        {slot.time}
                      </div>
                      <div className="text-lg text-gray-500">{slot.label}</div>
                    </div>

                    {weekDays.map((day, dayIndex) => {
                      const assignments = getAssignmentsForSlotFromOrganized(
                        day,
                        slot.time,
                      );

                      const filteredAssignments = assignments.filter(
                        (assignment: {
                          orderName: any;
                          guardName: any;
                          type: any;
                          guards: {};
                          orderId: string;
                          guardId: string;
                          description: string;
                        }) => {
                          const guard = assignment.guards || {};

                          const matchesOrder =
                            filterOrder === "all" ||
                            assignment.orderId === filterOrder ||
                            assignment.orderName
                              ?.toLowerCase()
                              .includes(filterOrder.toLowerCase());

                          const matchesGuard =
                            filterGuard === "all" ||
                            assignment.guardId === filterGuard;

                          const matchesRole =
                            filterRole === "all" ||
                            assignment.type?.toLowerCase() ===
                              filterRole.toLowerCase();

                          const matchesSearch =
                            !searchTerm ||
                            assignment.guardName
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            assignment.description
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase());

                          return (
                            matchesOrder &&
                            matchesGuard &&
                            matchesRole &&
                            matchesSearch
                          );
                        },
                      );

                      return (
                        <div
                          key={dayIndex}
                          className={`
                    p-2 border-r border-gray-200 min-h-[70px] relative group cursor-pointer transition-all
                    ${day.toDateString() === selectedDate.toDateString() ? "bg-blue-50" : "hover:bg-gray-50"}
                  `}
                          onClick={() => {
                            setSelectedDate(new Date(day));
                            setFormData({ ...formData, startTime: slot.time });
                            handleCreateAssignment();
                          }}
                        >
                          {filteredAssignments.length > 0 ? (
                            <div className="space-y-1">
                              {filteredAssignments.map((assignment: any) => {
                                const guard = {
                                  id: assignment.guardId,
                                  name: assignment.guardName,
                                  email: assignment.guardEmail,
                                  status: assignment.status,
                                };

                                return (
                                  <div
                                    key={assignment.id}
                                    className={`
                              p-2 rounded-md text-lg cursor-pointer transition-all border group-hover:shadow-sm
                              ${
                                assignment.type === "patrol"
                                  ? "bg-linear-to-r from-orange-100 to-orange-50 text-orange-900 border-orange-200 hover:from-orange-200 hover:to-orange-100"
                                  : "bg-linear-to-r from-green-100 to-green-50 text-green-900 border-green-200 hover:from-green-200 hover:to-green-100"
                              }
                            `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditDialog(assignment);
                                    }}
                                    title={`${guard?.name || "No Guard"} - ${assignment.description}`}
                                  >
                                    {/* GUARD NAME */}
                                    <div className="font-medium truncate">
                                      {guard?.name || "Unassigned Guard"}
                                    </div>

                                    {/* SHIFT DESCRIPTION */}
                                    <div className="text-lg opacity-80 truncate">
                                      {assignment.orderName ||
                                        assignment.description ||
                                        "No Description"}
                                    </div>

                                    {/* TIME RANGE */}
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-3 w-3 text-gray-500" />
                                      <span className="text-lg text-gray-700 font-medium">
                                        {formatShiftTime(
                                          assignment.start,
                                          assignment.end,
                                        )}
                                      </span>
                                    </div>

                                    {/* STATUS */}
                                    <Badge
                                      variant="outline"
                                      className="text-lg px-0 py-0 border-2 overflow-hidden"
                                      style={getStatusStyle(
                                        guard.status ||
                                          assignment.status ||
                                          "pending",
                                      )}
                                    >
                                      {
                                        getStatusColor(
                                          guard.status ||
                                            assignment.status ||
                                            "pending",
                                        ).label
                                      }
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-gray-600 transition-colors">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="h-4 w-4 mb-1" />
                              </div>
                              <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                Add
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ADD THIS AT THE END - Edit Assignment Dialog */}
        <EditAssignmentDialog
          assignment={selectedAssignment}
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedAssignment(null);
          }}
          onSave={(updatedData) => {
            // TODO: Call your update API here
            console.log("Saving assignment:", updatedData);
            toast.success("Assignment updated successfully!");
            setShowEditDialog(false);
            setSelectedAssignment(null);
            // Refresh your assignments list if needed
          }}
          guards={guards || []} // Pass your guards array
          orders={orders || []} // Pass your orders array
        />

        {/* Selected Date Summary Bar */}
        {viewMode === "weekly" && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <CardContent className="p-4">
              {/* Row 1: Date and Quick Stats */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedDate.getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200">
                    <User className="h-4 w-4 text-blue-600" />
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {getFilteredAssignments(selectedDate).length}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-green-200">
                    <Clock className="h-4 w-4 text-green-600" />
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {
                          getFilteredAssignments(selectedDate).filter(
                            (a: { StaticGuards?: { status: string } }) =>
                              a.StaticGuards?.status === "Active",
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-500">Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Assignment Pills */}
              {getFilteredAssignments(selectedDate).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getFilteredAssignments(selectedDate)
                    .slice(0, 4)
                    .map(
                      (
                        assignment: {
                          role: string;
                          name:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                          time:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactPortal
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | null
                                | undefined
                              >
                            | null
                            | undefined;
                        },
                        idx: React.Key | null | undefined,
                      ) => (
                        <div
                          key={idx}
                          className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all shadow-sm
                ${
                  assignment.role === "Patrol"
                    ? "bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-300"
                    : "bg-green-100 text-green-900 hover:bg-green-200 border border-green-300"
                }
              `}
                          onClick={() => handleEditAssignment(assignment)}
                        >
                          <div
                            className={`p-1 rounded ${assignment.role === "Patrol" ? "bg-orange-200" : "bg-green-200"}`}
                          >
                            <User className="h-3 w-3" />
                          </div>
                          <span className="font-semibold">
                            {assignment.name}
                          </span>
                          <span className="opacity-50">•</span>
                          <Clock className="h-3 w-3 opacity-70" />
                          <span className="opacity-90">{assignment.time}</span>
                        </div>
                      ),
                    )}
                  {getFilteredAssignments(selectedDate).length > 4 && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border-2 border-dashed border-gray-300 text-gray-600">
                      <span className="font-semibold">
                        +{getFilteredAssignments(selectedDate).length - 4}
                      </span>
                      <span>more assignments</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">
                    No assignments scheduled for this date
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alerts & Reminders</DialogTitle>
            <DialogDescription>
              Upcoming assignments and notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border"
              >
                <Bell className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">{reminder.message}</div>
                  <div className="text-lg text-gray-600">
                    {reminder.assignee} • {formatDateTime(reminder.time).time}{" "}
                    on {formatDateTime(reminder.time).date}
                  </div>
                </div>
                <Badge variant="outline">{reminder.type}</Badge>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowAlertsDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Guard Assignment</DialogTitle>
            <DialogDescription>Assign guards to a shift</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="description" className="mb-1 block">
                Assignment Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the assignment details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* START DATE */}
            <div className="flex flex-col gap-2">
              <Label>
                Start Date <span className="text-red-500">*</span>
              </Label>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setOpenStartCalendar(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date
                  ? new Date(formData.date + "T00:00:00").toLocaleDateString()
                  : "Pick start date"}
              </Button>

              <Dialog
                open={openStartCalendar}
                onOpenChange={setOpenStartCalendar}
              >
                <DialogContent className="w-auto max-w-fit p-4 overflow-hidden">
                  <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={
                        formData.date
                          ? new Date(formData.date + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date: any) => {
                        if (!date) return;

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const localDateString = `${year}-${month}-${day}`;

                        setFormData({
                          ...formData,
                          date: localDateString,
                          // Clear endDate if it's before the new start date
                          endDate:
                            formData.endDate &&
                            formData.endDate < localDateString
                              ? ""
                              : formData.endDate,
                        });
                        setOpenStartCalendar(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);
                        return checkDate < today;
                      }}
                      fromDate={new Date()}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* END DATE */}
            <div className="flex flex-col gap-2">
              <Label>
                End Date <span className="text-red-500">*</span>
              </Label>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setOpenEndCalendar(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate
                  ? new Date(
                      formData.endDate + "T00:00:00",
                    ).toLocaleDateString()
                  : "Pick end date"}
              </Button>

              <Dialog open={openEndCalendar} onOpenChange={setOpenEndCalendar}>
                <DialogContent className="w-auto max-w-fit p-4 overflow-hidden">
                  <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={
                        formData.endDate
                          ? new Date(formData.endDate + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date: any) => {
                        if (!date) return;

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const localDateString = `${year}-${month}-${day}`;

                        setFormData({
                          ...formData,
                          endDate: localDateString,
                        });
                        setOpenEndCalendar(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);

                        // Disable past dates
                        if (checkDate < today) return true;

                        // Disable dates before start date
                        if (formData.date) {
                          const startDate = new Date(
                            formData.date + "T00:00:00",
                          );
                          startDate.setHours(0, 0, 0, 0);
                          return checkDate < startDate;
                        }

                        return false;
                      }}
                      fromDate={
                        formData.date
                          ? new Date(formData.date + "T00:00:00")
                          : new Date()
                      }
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Order Address */}
            <div>
              <Label htmlFor="order" className="mb-1 block">
                Order Address <span className="text-red-500">*</span>
              </Label>

              <Select
                value={String(formData.orderId ?? "")}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, orderId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Address" />
                </SelectTrigger>

                <SelectContent
                  className="max-h-56 overflow-y-auto z-50"
                  style={{ maxHeight: "14rem", overflowY: "auto" }}
                >
                  {(() => {
                    const allowedOrders = (orders || []).filter(
                      (o: any) =>
                        !["completed", "cancelled", "pending"].includes(
                          (o.status || "").toLowerCase(),
                        ),
                    );
                    return allowedOrders.length > 0 ? (
                      allowedOrders.map((order: any) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.locationAddress ?? order.id}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-3 text-lg text-gray-500">
                        No active orders available
                      </div>
                    );
                  })()}
                </SelectContent>
              </Select>
            </div>

            {/* Order Name */}
            <div>
              <Label htmlFor="order" className="mb-1 block">
                Order Name
              </Label>

              <Select
                value={String(formData.orderId ?? "")}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, orderId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select name" />
                </SelectTrigger>

                <SelectContent
                  className="max-h-56 overflow-y-auto z-50"
                  style={{ maxHeight: "14rem", overflowY: "auto" }}
                >
                  {(() => {
                    const allowedOrders = (orders || []).filter(
                      (o: any) =>
                        !["completed", "cancelled", "pending"].includes(
                          (o.status || "").toLowerCase(),
                        ),
                    );
                    return allowedOrders.length > 0 ? (
                      allowedOrders.map((order: any) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.locationName ?? order.id}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-3 text-lg text-gray-500">
                        No active orders available
                      </div>
                    );
                  })()}
                </SelectContent>
              </Select>
            </div>

            {/* Multi-select Guards Dropdown */}
            <div>
              <Label className="mb-1 block">
                Select Guards (Multiple) <span className="text-red-500">*</span>
              </Label>

              <Select open={guardsOpen} onOpenChange={setGuardsOpen}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.guardIds.length > 0
                        ? `${formData.guardIds.length} guard(s) selected`
                        : "Select Guards"
                    }
                  />
                </SelectTrigger>

                <SelectContent
                  className="max-h-56 overflow-y-auto z-50"
                  style={{ maxHeight: "14rem", overflowY: "auto" }}
                >
                  {guards && guards.length > 0 ? (
                    guards.map((guard: any) => {
                      const isChecked = formData.guardIds.includes(guard.id);

                      return (
                        <div
                          key={guard.id}
                          className="flex items-center px-2 py-1 space-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (isChecked) {
                              setFormData({
                                ...formData,
                                guardIds: formData.guardIds.filter(
                                  (id: string) => id !== guard.id,
                                ),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                guardIds: [...formData.guardIds, guard.id],
                              });
                            }
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked: any) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  guardIds: [...formData.guardIds, guard.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  guardIds: formData.guardIds.filter(
                                    (id: string) => id !== guard.id,
                                  ),
                                });
                              }
                            }}
                            onClick={(e: { stopPropagation: () => any }) =>
                              e.stopPropagation()
                            }
                          />

                          <span className="text-lg">
                            {guard.name} ({guard.mobile})
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-lg text-gray-500">
                      No Guards available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4">
              {/* START TIME */}
              <div className="space-y-1">
                <Label
                  htmlFor="editStartTime"
                  className="text-lg font-medium text-gray-700"
                >
                  Start Time <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="editStartTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="h-11 rounded-lg border-gray-300
                       focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              {/* END TIME */}
              <div className="space-y-1">
                <Label
                  htmlFor="editEndTime"
                  className="text-lg font-medium text-gray-700"
                >
                  End Time <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="editEndTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="h-11 rounded-lg border-gray-300
                       focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                setShowCreateDialog(false);
              }}
            >
              Delete Assignment
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Validate before submitting
                  if (!formData.description?.trim()) {
                    toast.error("Please enter assignment description");
                    return;
                  }
                  if (!formData.date) {
                    toast.error("Please select a date");
                    return;
                  }
                  if (!formData.orderId) {
                    toast.error("Please select an order");
                    return;
                  }

                  // ✅ EXTRA SAFETY: Check if selected order is completed/cancelled
                  const selectedOrder = (orders || []).find(
                    (o: any) => o.id === formData.orderId,
                  );
                  if (
                    selectedOrder &&
                    ["completed", "cancelled"].includes(
                      (selectedOrder.status || "").toLowerCase(),
                    )
                  ) {
                    toast.error(
                      "Cannot create assignment for a completed or cancelled order",
                    );
                    return;
                  }

                  if (formData.guardIds.length === 0) {
                    toast.error("Please select at least one guard");
                    return;
                  }
                  if (!formData.startTime) {
                    toast.error("Please enter start time");
                    return;
                  }
                  if (!formData.endTime) {
                    toast.error("Please enter end time");
                    return;
                  }
                  if (formData.startTime >= formData.endTime) {
                    toast.error("End time must be after start time");
                    return;
                  }

                  // All validations passed
                  handleCreateSchedule();
                }}
                disabled={
                  isCreating ||
                  !formData.description?.trim() ||
                  !formData.date ||
                  !formData.orderId ||
                  formData.guardIds.length === 0 ||
                  !formData.startTime ||
                  !formData.endTime
                }
              >
                {isCreating ? "Saving..." : "Create Assignment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
