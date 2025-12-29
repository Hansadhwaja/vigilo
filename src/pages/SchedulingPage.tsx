

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Clock, User, MapPin, Edit, Trash2, Eye, Bell, Repeat, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useGetAllGuardsQuery } from "../apis/guardsApi";
import { useCreateScheduleMutation, useDeleteScheduleMutation, useGetAllSchedulesQuery } from "../apis/schedulingAPI";
import { useGetAllOrdersQuery } from "../apis/ordersApi";
import { toast } from "sonner";

import { DatePicker } from "@heroui/react";
import { useRef } from "react";


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
    assignee: "Lisa Rodriguez"
  },
  {
    id: "REM-002",
    type: "Patrol Assignment", 
    message: "Vehicle patrol assignment due",
    time: new Date(Date.now() + 3600000).toISOString(),
    assignee: "Mike Chen"
  }
];
// Convert to Local Date object
const toLocalTime = (isoString: string | number | Date) => new Date(isoString);

// HH:MM formatter
const getTimeHHMM = (dateObj: Date) => dateObj.toTimeString().slice(0, 5);

// Duration
const getDuration = (start: string | number | Date, end: string | number | Date) => {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
  return `${diff} hours`;
};

export const organizeShifts = (scheduleList: any[], timeSlots: any[]) => {
  const organized: { [key: string]: any } = {};

  const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  scheduleList.forEach((shift) => {
    const start = toLocalTime(shift.startTime);
    const end = toLocalTime(shift.endTime);

    const dateKey = start.toISOString().split("T")[0];

    // ❗ FIX — use LOCAL TIME for comparison (not UTC)
    const shiftStartHHMM = getTimeHHMM(start);
    const shiftStartMin = toMinutes(shiftStartHHMM);

    // find matching slot
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

    if (!matchedSlot) return;

    if (!organized[dateKey]) organized[dateKey] = {};
    if (!organized[dateKey][matchedSlot]) organized[dateKey][matchedSlot] = [];

    // add guard-based assignments
    shift.guards.forEach((guard: any) => {
      organized[dateKey][matchedSlot].push({
        shiftId: shift.id,
        guardId: guard.id,
        id: `${shift.id}-${guard.id}`,

        guardName: guard.name,
        guardEmail: guard.email,
        guardStatus: guard.StaticGuards?.status || shift.status,

        orderId: shift.orderId,
        orderLocationName: shift.locationName || "Unknown Location",
        orderName: shift.orderName || "Unknown Location",

        description: shift.description,
        type: shift.type,
        status: shift.status,

        timeSlot: matchedSlot,
        start,
        end,
        duration: getDuration(shift.startTime, shift.endTime),
      });
    });
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

  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const startRef = useRef<HTMLInputElement>(null);
const endRef = useRef<HTMLInputElement>(null);
    
  
  // Filter states
  const [filterOrder, setFilterOrder] = useState("all");
  const [filterGuard, setFilterGuard] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  //delete a schedule
  const [deleteSchedule] = useDeleteScheduleMutation();
  const handleDelete = async (id: string, e: any) => {
  e.stopPropagation();
  console.log("Starting deleting schedule with id:", id);

  try {
    const res = await deleteSchedule({ id }).unwrap();

    if (res.success) {
      toast.success("Schedule deleted successfully");
    } else {
      toast.error(res.message || "Failed to delete schedule");
    }
  } catch (error) {
    toast.error("Something went wrong while deleting");
  }
};

  // Helpers: timezone constants & formatters
const TIMEZONE = "Asia/Kolkata";

const formatDateStr = (iso: string | Date) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { timeZone: TIMEZONE, year: "numeric", month: "short", day: "numeric" });
};

const formatTimeStr = (iso: string | Date) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatHourShort = (iso: string | Date) => {
  // e.g. "02:30 PM" — used where only start time required
  return formatTimeStr(iso);
};


  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();

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
      date: jsDate.toISOString(),            // FIXED
      orderId: formData.orderId,
      guardIds: formData.guardIds,
      startTime: formData.startTime,         // already HH:mm format or ISO — OK
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
    date: selectedDate,
    startTime: "",
    endTime: "",
    guardIds: [] as string[],
    orderId: "",
    role: "",
    recurring: "none"
  });

    const { data: schedulingResponse } = useGetAllSchedulesQuery(
     );
   
     // Extract schedule data from API response
     const schedule = schedulingResponse?.data || [];
     console.log("Fetched Schedules:", schedule);

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
       { time: "22:00", label: "10 pm" }
     ];

     const organizedShifts = useMemo(() => {
  return organizeShifts(schedule, timeSlots);
}, [schedule, timeSlots]);

const getAssignmentsForSlotFromOrganized = (day: { toISOString: () => string; }, time: string | number) => {
  const dateKey = day.toISOString().split("T")[0];
  return organizedShifts[dateKey]?.[time] || [];
};

const formatShiftTime = (start: { toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => any; }, end: { toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => any; }) => {
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
    const { data: guardsResponse, isLoading, isError, error, isFetching } = useGetAllGuardsQuery(
      {
        limit: itemsPerPage,
        page: currentPage,
        search: debouncedSearch || undefined,
      },
      {
        // Refetch when any parameter changes
        refetchOnMountOrArgChange: true,
      }
    );
  
    // Extract guards data from API response
    const guards = guardsResponse?.data || [];

    //fetch orders from API
    const { data: ordersResponse } = useGetAllOrdersQuery();
    const orders = ordersResponse?.data || [];

    const scheduleData = useMemo(() => {
  // `schedule` is API response array (from useGetAllSchedulesQuery)
  // if schedule is undefined, return empty
  const arr = (schedule || []).map(item => {
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
    const guards = (item.guards || []).map(g => {
        
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
        timeStart: assignmentStart,    // Date object (local conversion will depend on display)
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
        const hours = (correctedEnd.getTime() - startDateObj.getTime()) / (1000 * 60 * 60);
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
  return Object.values(groupedByDay).sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
}, [schedule]);



    

  // Calculate metrics
 const metrics = useMemo(() => {
  const allAssignments = scheduleData.flatMap(s => s.guards);
  const todayAssignments = scheduleData.find(s => s.date.toDateString() === today.toDateString())?.guards || [];

  return {
    activeShifts: todayAssignments.filter((g: { StaticGuards: { status: string; }; }) => g.StaticGuards?.status === "active").length,
    scheduledToday: todayAssignments.length,
    totalThisWeek: allAssignments.length,
    patrolsActive: allAssignments.filter(g => g.role === "Patrol" && g.StaticGuards?.status === "active").length,
  };
}, [scheduleData, today]);



  // Get assignments for selected date with filters
  const getFilteredAssignments = (date: Date) => {
  const dayData = scheduleData.find(day => day.date.toDateString() === date.toDateString());
  if (!dayData) return [];

  return dayData.guards.filter((assignment: { orderId: string; guardId: string; id: string; role: any; name: any; description: any; }) => {
    const matchesOrder = filterOrder === "all" || assignment.orderId === filterOrder;
    const matchesGuard = filterGuard === "all" || assignment.guardId === filterGuard || assignment.id === filterGuard;
    const matchesRole = filterRole === "all" || (assignment.role || "").toLowerCase() === filterRole.toLowerCase();
    const matchesSearch = !searchTerm ||
      (assignment.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesOrder && matchesGuard && matchesRole && matchesSearch;
  });
};


  // Get all assignments for calendar view
  const getDateAssignments = (date: Date) => {
    const dayData = scheduleData.find(day => 
      day.date.toDateString() === date.toDateString()
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
      date: selectedDate,
      startTime: "",
      endTime: "",
      guardIds: [],
      orderId: "",
      role: "",
      recurring: "none"
    });
    setShowCreateDialog(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setFormData({
      description: assignment.description || "",
      date: selectedDate,
      startTime: assignment.time.split('-')[0],
      endTime: assignment.time.split('-')[1],
      guardIds: [assignment.id],
      orderId: assignment.orderId,
      role: assignment.role,
      recurring: "none"
    });
    setShowEditDialog(true);
  };

  // const handleSaveAssignment = () => {
  //   const order = orders.find(o => o.id === formData.orderId);
    
  //   if (formData.guardIds.length === 0 || !order) return;

    // Create assignments for each selected guard
  //   const newAssignments = formData.guardIds
  //     .map(guardId => {
  //       const guard = guards.find(g => g.id === guardId);
  //       if (!guard) return null;

  //       return {
  //         id: guardId,
  //         name: guard.name,
  //         role: formData.role,
  //         time: `${formData.startTime}-${formData.endTime}`,
  //         orderId: formData.orderId,
  //         orderName: order.locationAddress,
  //         description: formData.description,
  //         status: "Scheduled"
  //       };
  //     })
  //     .filter((assignment): assignment is NonNullable<typeof assignment> => assignment !== null);

  //   setScheduleData(prev => {
  //     const dateKey = formData.date.toDateString();
  //     const existingDayIndex = prev.findIndex(day => day.date.toDateString() === dateKey);
      
  //     if (existingDayIndex >= 0) {
  //       const updatedDay = { ...prev[existingDayIndex] };
  //       updatedDay.guards = [...updatedDay.guards, ...newAssignments];
  //       const newData = [...prev];
  //       newData[existingDayIndex] = updatedDay;
  //       return newData;
  //     } else {
  //       return [...prev, {
  //         id: `SCH-${Date.now()}`,
  //         date: new Date(formData.date),
  //         guards: newAssignments
  //       }];
  //     }
  //   });

  //   setShowCreateDialog(false);
  // };

  // const handleDeleteAssignment = (assignmentId: string, date: Date) => {
  //   setScheduleData(prev => {
  //     return prev.map(day => {
  //       if (day.date.toDateString() === date.toDateString()) {
  //         return {
  //           ...day,
  //           guards: day.guards.filter(g => g.id !== assignmentId || g.time !== selectedAssignment?.time)
  //         };
  //       }
  //       return day;
  //     }).filter(day => day.guards.length > 0);
  //   });
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  const dayData = scheduleData.find(day => 
    new Date(day.date).toDateString() === date.toDateString()
  );

  if (!dayData) return [];

  return dayData.guards.filter((assignment: any) => {
    //  backend returns ISO strings:
    // "startTime": "2025-11-28T11:25:00.000Z"
    const assignmentStart = new Date(assignment.rawStartISO)
      .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    return assignmentStart === timeSlot;
  });
};


  // Navigation helpers
  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
    setCurrentMonth(newDate);
  };

  return (
    <div className="space-y-3">
      {/* Compact Header with Summary Cards Inline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">Scheduling Calendar</h1>
          <p className="text-gray-600 text-lg">Managed Assignment & Calendar View</p>
        </div>
        
        {/* Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{metrics.activeShifts}</div>
              <div className="text-lg text-green-600">Active Now</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{metrics.scheduledToday}</div>
              <div className="text-lg text-blue-600">Today</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <User className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">{metrics.totalThisWeek}</div>
              <div className="text-lg text-purple-600">This Week</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <MapPin className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">{metrics.patrolsActive}</div>
              <div className="text-lg text-orange-600">Patrols</div>
            </div>
          </div>
          
          <Button onClick={handleCreateAssignment} className="flex items-center gap-2 ml-2">
            <Plus className="h-4 w-4" />
            Assign Guard
          </Button>
        </div>
      </div>

      {/* Compact Filters and Controls Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        {/* Compact Filters */}
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
          <Filter className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-32 h-8"
          />
          <Select value={filterOrder} onValueChange={setFilterOrder}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {orders.map(order => (
                <SelectItem key={order.id} value={order.id}>{order.locationAddress}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGuard} onValueChange={setFilterGuard}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Guard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guards</SelectItem>
              {guards.map(guard => (
                <SelectItem key={guard.id} value={guard.id}>{guard.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32 h-8">
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
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
                      <span className="font-bold text-blue-900">{getFilteredAssignments(selectedDate).length}</span> 
                      <span className="text-gray-600 ml-1">Total Shifts</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-lg">
                      <span className="font-bold text-orange-900">
                        {getFilteredAssignments(selectedDate).filter((a: { role: string; }) => a.role === 'Patrol').length}
                      </span> 
                      <span className="text-gray-600 ml-1">Patrol</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-lg">
                      <span className="font-bold text-green-900">
                        {getFilteredAssignments(selectedDate).filter((a: { role: string; }) => a.role === 'static').length}
                      </span> 
                      <span className="text-gray-600 ml-1">Static</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-lg">
                      <span className="font-bold text-purple-900">
                        {new Set(getFilteredAssignments(selectedDate).map((a: { orderId: any; }) => a.orderId)).size}
                      </span> 
                      <span className="text-gray-600 ml-1">Orders</span>
                    </span>
                  </div>
                </div>

                {/* All Shifts Displayed as Cards */}
                {getFilteredAssignments(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {Array.from(new Set(getFilteredAssignments(selectedDate).map((a: { time: string; }) => a.time.split('-')[0]))).sort().map((startTime: unknown) => {
                      const timeStr = String(startTime);
                      const shiftsAtTime = getFilteredAssignments(selectedDate).filter((a: { time: string; }) => a.time.split('-')[0] === timeStr);
                      
                      return (
                        <div key={timeStr} className="space-y-2">
                          <div className="flex items-center gap-2 px-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">{timeStr}</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-lg text-gray-500">{shiftsAtTime.length} shift{shiftsAtTime.length > 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {shiftsAtTime.map((assignment: {
                              shiftId: string;
                              
                              
                              id: string; role: string; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; time: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; orderId: string; StaticGuards: { status: string; }; status: any; 
}, idx: React.Key | null | undefined) => (
  
                              <div
                                key={assignment.id}
                                className={`
                                  relative p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer
                                  ${assignment.role === 'Patrol' 
                                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:border-orange-400' 
                                    : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400'
                                  }
                                `}
                                onClick={() => handleEditAssignment(assignment)}
                              >
                                
                                <div className="absolute top-2 right-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      text-lg px-2 py-0.5
                                      ${assignment.role === 'patrol' 
                                        ? 'bg-orange-200 text-orange-900 border-orange-400' 
                                        : 'bg-green-200 text-green-900 border-green-400'
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
                                      <span className="font-bold text-gray-900">{assignment.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-lg text-gray-700">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-medium">{assignment.time}</span>
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
                                          <div className={`
                                            px-2 py-0.5 rounded-full text-lg font-medium
                                            ${assignment.orderId === 'o1' ? 'bg-blue-200 text-blue-900' :
                                              assignment.orderId === 'o2' ? 'bg-purple-200 text-purple-900' :
                                              assignment.orderId === 'o3' ? 'bg-cyan-200 text-cyan-900' :
                                              assignment.orderId === 'o4' ? 'bg-amber-200 text-amber-900' :
                                              assignment.orderId === 'o5' ? 'bg-pink-200 text-pink-900' :
                                              'bg-teal-200 text-teal-900'
                                            }
                                          `}>
                                            {assignment.description}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-lg ${getStatusColor(assignment.status)}`}
                                    >
                                      {assignment.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                      
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                                        onClick={(e: any) => handleDelete(assignment.shiftId, e)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">No Shifts Scheduled</h3>
                    <p className="text-lg text-gray-500 mb-4">No guard assignments for this date</p>
                    <Button onClick={handleCreateAssignment} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                )}

                {/* Order Legend */}
                {getFilteredAssignments(selectedDate).length > 0 && (
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="text-lg font-medium text-gray-600 mb-2">ORDER LEGEND</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(getFilteredAssignments(selectedDate).map((a: { orderId: any; }) => a.orderId))).map(orderId => {
                        const assignment = getFilteredAssignments(selectedDate).find((a: { orderId: unknown; }) => a.orderId === orderId);
                        return (
                          <div
                            key={orderId as string}
                            className={`
                              px-3 py-1 rounded-full text-lg font-medium
                              ${orderId === 'o1' ? 'bg-blue-200 text-blue-900' :
                                orderId === 'o2' ? 'bg-purple-200 text-purple-900' :
                                orderId === 'o3' ? 'bg-cyan-200 text-cyan-900' :
                                orderId === 'o4' ? 'bg-amber-200 text-amber-900' :
                                orderId === 'o5' ? 'bg-pink-200 text-pink-900' :
                                'bg-teal-200 text-teal-900'
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
                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                  const monthName = day.toLocaleDateString('en-US', { month: 'short' });
                  
                  return (
                    <div 
                      key={index} 
                      className={`
                        p-3 border-r border-gray-200 text-center cursor-pointer transition-all
                        ${isSelected 
                          ? 'bg-blue-500 text-white' 
                          : isToday 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : 'hover:bg-gray-200'
                        }
                      `}
                      onClick={() => setSelectedDate(new Date(day))}
                    >
                      <div className="font-semibold text-lg">{dayName}</div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-white' : isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </div>
                      <div className={`text-lg ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {monthName}
                      </div>
                    </div>
                  );
                })}
              </div>

              {timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                  <div className="p-3 border-r border-gray-200 bg-gray-50">
                    <div className="font-semibold text-gray-900 text-lg">{slot.time}</div>
                    <div className="text-lg text-gray-500">{slot.label}</div>
                  </div>
                  
                  {weekDays.map((day, dayIndex) => {

  const assignments = getAssignmentsForSlotFromOrganized(day, slot.time);

  const filteredAssignments = assignments.filter((assignment: {
      orderName: any;
      guardName: any;
      type: any; guards: {}; orderId: string; guardId: string; description: string; 
}) => {
  const guard = assignment.guards || {};

  const matchesOrder =
  filterOrder === "all" ||
  assignment.orderId === filterOrder ||
  assignment.orderName?.toLowerCase().includes(filterOrder.toLowerCase());


  const matchesGuard =
    filterGuard === "all" || assignment.guardId === filterGuard;

  const matchesRole =
    filterRole === "all" ||
    assignment.type?.toLowerCase() === filterRole.toLowerCase();

  const matchesSearch =
    !searchTerm ||
    assignment.guardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesOrder && matchesGuard && matchesRole && matchesSearch;
});


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
                    {filteredAssignments.map((assignment: {
                        orderName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | React.ReactPortal | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined> | null | undefined;
                        guardName: any;
                        guardEmail: any;
                        guardId: any; guards: any[]; id: React.Key | null | undefined; type: string; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; start: { toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => any; }; end: { toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => any; }; status: any; 
}) => {
                        console.log("Assignment:", assignment);
    const guard = {
  id: assignment.guardId,
  name: assignment.guardName,
  email: assignment.guardEmail,
  status: assignment.status
};

    
    return (
      <div
        key={assignment.id}
        className={`
          p-2 rounded-md text-lg cursor-pointer transition-all border group-hover:shadow-sm
          ${
            assignment.type === "patrol"
              ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-900 border-orange-200 hover:from-orange-200 hover:to-orange-100"
              : "bg-gradient-to-r from-green-100 to-green-50 text-green-900 border-green-200 hover:from-green-200 hover:to-green-100"
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          handleEditAssignment(assignment);
        }}
        title={`${guard?.name || "No Guard"} - ${assignment.description}`}
      >
        {/* GUARD NAME */}
        <div className="font-medium truncate">
          {guard?.name || "Unassigned Guard"}
        </div>
  
        {/* SHIFT DESCRIPTION */}
        <div className="text-lg opacity-80 truncate">
          {assignment.orderName || assignment.description || "No Description"}
        </div>
  
        {/* TIME RANGE */}
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-gray-500" />
          <span className="text-lg text-gray-700 font-medium">
            {formatShiftTime(assignment.start, assignment.end)}
          </span>
        </div>
  
        {/* STATUS */}
        <Badge
          variant="outline"
          className={`text-lg px-1 py-0 ${getStatusColor(
            guard.status || assignment.status
          )}`}
        >
          {guard.status || assignment.status || "pending"}
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
          <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">Add</div>
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

        {/* Selected Date Summary Bar */}
        {viewMode === "weekly" && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">
                      {getFilteredAssignments(selectedDate).length} assignments
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    {/* <span className="text-gray-600">
                      {getFilteredAssignments(selectedDate).filter(a => a.StaticGuards.status === 'Active').length} active
                    </span> */}
                  </div>
                </div>
              </div>
              
              {getFilteredAssignments(selectedDate).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getFilteredAssignments(selectedDate).slice(0, 3).map((assignment: { role: string; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; time: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx: React.Key | null | undefined) => (
                    <div
                      key={idx}
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-lg cursor-pointer transition-all
                        ${assignment.role === 'Patrol' 
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }
                      `}
                      onClick={() => handleEditAssignment(assignment)}
                    >
                      <User className="h-3 w-3" />
                      {assignment.name} • {assignment.time}
                    </div>
                  ))}
                  {getFilteredAssignments(selectedDate).length > 3 && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-lg bg-gray-100 text-gray-600">
                      +{getFilteredAssignments(selectedDate).length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
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
              <div key={reminder.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border">
                <Bell className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">{reminder.message}</div>
                  <div className="text-lg text-gray-600">
                    {reminder.assignee} • {formatDateTime(reminder.time).time} on {formatDateTime(reminder.time).date}
                  </div>
                </div>
                <Badge variant="outline">{reminder.type}</Badge>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowAlertsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Guard Assignment</DialogTitle>
            <DialogDescription>
              Assign guards to a shift
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="description" className="mb-1 block">Assignment Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the assignment details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

<div className="flex flex-col gap-2">
  <Label>Date</Label>

  <Button
    variant="outline"
    className="w-full justify-start"
    onClick={() => setOpenCalendar(true)}
  >
    <CalendarIcon className="mr-2 h-4 w-4" />
    {formData.date ? new Date(formData.date).toLocaleDateString() : "Pick a date"}
  </Button>

  <Dialog open={openCalendar} onOpenChange={setOpenCalendar}>
  <DialogContent className="w-auto max-w-fit p-4 overflow-hidden">
    <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg">
      <Calendar
        mode="single"
        selected={formData.date ? new Date(formData.date) : undefined}
        onSelect={(date: any) => {
          if (!date) return;
          setFormData({
            ...formData,
            date: date.toISOString().split("T")[0],
          });
          setOpenCalendar(false);
        }}
      />
    </div>
  </DialogContent>
</Dialog>

</div>



            {/* Order select with scrollbar */}
      <div>
        <Label htmlFor="order" className="mb-1 block">Order Address</Label>

        <Select
          value={String(formData.orderId ?? "")}
          onValueChange={(value: string) => setFormData({ ...formData, orderId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>

          {/* ensure overflow + z-index + fixed max height */}
          <SelectContent className="max-h-56 overflow-y-auto z-50" style={{ maxHeight: "14rem", overflowY: "auto" }}>
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.locationAddress  ?? order.id}
                </SelectItem>
              ))
            ) : (
              <div className="p-3 text-lg text-gray-500">No orders available</div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Order select with scrollbar */}
      <div>
        <Label htmlFor="order" className="mb-1 block">Order Name</Label>

        <Select
          value={String(formData.orderId ?? "")}
          onValueChange={(value: string) => setFormData({ ...formData, orderId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>

          {/* ensure overflow + z-index + fixed max height */}
          <SelectContent className="max-h-56 overflow-y-auto z-50" style={{ maxHeight: "14rem", overflowY: "auto" }}>
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.locationName  ?? order.id}
                </SelectItem>
              ))
            ) : (
              <div className="p-3 text-lg text-gray-500">No orders available</div>
            )}
          </SelectContent>
        </Select>
      </div>

            {/* Multi-select Guards Dropdown */}
{/* Multi-select Guards Dropdown */}
<div>
  <Label className="mb-1 block">Select Guards (Multiple)</Label>

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
                e.stopPropagation(); // prevent closing dropdown

                if (isChecked) {
                  setFormData({
                    ...formData,
                    guardIds: formData.guardIds.filter(
                      (id: string) => id !== guard.id
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
                        (id: string) => id !== guard.id
                      ),
                    });
                  }
                }}
                onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
              />

              <span className="text-lg">
                {guard.name} ({guard.role ?? "N/A"})
              </span>
            </div>
          );
        })
      ) : (
        <div className="p-3 text-lg text-gray-500">No Guards available</div>
      )}
    </SelectContent>
  </Select>

  <p className="text-lg text-gray-500 mt-1">
    {formData.guardIds.length} guard(s) selected
  </p>
</div>


        

<div className="col-span-2 grid grid-cols-2 gap-4">
  {/* START TIME */}
  <div className="space-y-1">
    <Label htmlFor="editStartTime" className="text-lg font-medium text-gray-700">
      Start Time
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
    <Label htmlFor="editEndTime" className="text-lg font-medium text-gray-700">
      End Time
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
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSchedule} disabled={isCreating}>
  {isCreating ? "Saving..." : "Create Assignment"}
</Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}