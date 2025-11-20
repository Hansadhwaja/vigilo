import React, { useState, useMemo } from "react";
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

// Order list (previously clientList)
const orderList = [
  { id: "o1", name: "Metropolitan Bank Security", type: "Corporate" },
  { id: "o2", name: "Shopping Mall Patrol", type: "Retail" },
  { id: "o3", name: "Tech Park Security", type: "Corporate" },
  { id: "o4", name: "Industrial Site Protection", type: "Industrial" },
  { id: "o5", name: "University Campus Guard", type: "Education" },
  { id: "o6", name: "Medical Center Security", type: "Healthcare" }
];

// Sample schedule data for current week
const sampleScheduleData = [
  {
    id: "SCH-001",
    date: currentWeek[0], // Sunday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Main entrance security duty",
        status: "Scheduled"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Patrol", 
        time: "08:00-16:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Regular patrol rounds",
        status: "Scheduled"
      },
      { 
        id: "g5", 
        name: "L. Rodriguez", 
        role: "Static", 
        time: "14:00-22:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Evening shift coverage",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-002",
    date: currentWeek[1], // Monday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Morning security operations",
        status: "Scheduled"
      },
      { 
        id: "g4", 
        name: "J. Ali", 
        role: "Patrol", 
        time: "06:00-14:00", 
        orderId: "o4",
        orderName: "Industrial Site Protection",
        description: "Site perimeter patrol",
        status: "Scheduled"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Static", 
        time: "10:00-18:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Day shift monitoring",
        status: "Scheduled"
      },
      { 
        id: "g5", 
        name: "L. Rodriguez", 
        role: "Static", 
        time: "14:00-22:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Afternoon security duty",
        status: "Scheduled"
      },
      { 
        id: "g3", 
        name: "M. Chen", 
        role: "Static", 
        time: "22:00-06:00", 
        orderId: "o3",
        orderName: "Tech Park Security",
        description: "Night security operations",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-003", 
    date: currentWeek[2], // Tuesday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Morning shift",
        status: "Active"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Patrol", 
        time: "08:00-16:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Patrol duties",
        status: "Active"
      },
      { 
        id: "g4", 
        name: "J. Ali", 
        role: "Patrol", 
        time: "10:00-18:00", 
        orderId: "o6",
        orderName: "Medical Center Security",
        description: "Hospital perimeter patrol",
        status: "Scheduled"
      },
      { 
        id: "g5", 
        name: "L. Rodriguez", 
        role: "Static", 
        time: "14:00-22:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Evening shift",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-004", 
    date: currentWeek[3], // Wednesday
    guards: [
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Morning operations",
        status: "Scheduled"
      },
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Patrol", 
        time: "08:00-16:00", 
        orderId: "o4",
        orderName: "Industrial Site Protection",
        description: "Industrial site patrol",
        status: "Scheduled"
      },
      { 
        id: "g4", 
        name: "J. Ali", 
        role: "Patrol", 
        time: "14:00-22:00", 
        orderId: "o5",
        orderName: "University Campus Guard",
        description: "Campus security patrol",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-005", 
    date: currentWeek[4], // Thursday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o3",
        orderName: "Tech Park Security",
        description: "Tech park entrance security",
        status: "Scheduled"
      },
      { 
        id: "g3", 
        name: "M. Chen", 
        role: "Static", 
        time: "08:00-16:00", 
        orderId: "o6",
        orderName: "Medical Center Security",
        description: "Hospital main entrance",
        status: "Scheduled"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Patrol", 
        time: "10:00-18:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Mall security patrol",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-006", 
    date: currentWeek[5], // Friday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o1",
        orderName: "Metropolitan Bank Security",
        description: "Morning security",
        status: "Scheduled"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Static", 
        time: "06:00-14:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Shopping center security",
        status: "Scheduled"
      },
      { 
        id: "g4", 
        name: "J. Ali", 
        role: "Patrol", 
        time: "10:00-18:00", 
        orderId: "o6",
        orderName: "Medical Center Security",
        description: "Medical facility patrol",
        status: "Scheduled"
      }
    ]
  },
  {
    id: "SCH-007", 
    date: currentWeek[6], // Saturday
    guards: [
      { 
        id: "g1", 
        name: "A. Khan", 
        role: "Patrol", 
        time: "06:00-14:00", 
        orderId: "o2",
        orderName: "Shopping Mall Patrol",
        description: "Weekend patrol",
        status: "Scheduled"
      },
      { 
        id: "g2", 
        name: "S. Singh", 
        role: "Static", 
        time: "08:00-16:00", 
        orderId: "o3",
        orderName: "Tech Park Security",
        description: "Tech park security",
        status: "Scheduled"
      }
    ]
  }
];

const availableGuards = [
  { id: "g1", name: "A. Khan", roles: ["Static", "Patrol"], licences: ["VIC Sec", "First Aid"] },
  { id: "g2", name: "S. Singh", roles: ["Static", "Patrol"], licences: ["VIC Sec"] },
  { id: "g3", name: "M. Chen", roles: ["Static"], licences: ["VIC Sec", "WWCC"] },
  { id: "g4", name: "J. Ali", roles: ["Patrol"], licences: ["NSW Sec"] },
  { id: "g5", name: "Lisa Rodriguez", roles: ["Static", "Patrol"], licences: ["VIC Sec", "First Aid"] },
  { id: "g6", name: "David Wilson", roles: ["Patrol"], licences: ["VIC Sec"] }
];

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

export default function SchedulingPage() {
  const today = new Date();
  const [scheduleData, setScheduleData] = useState(sampleScheduleData);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [reminders] = useState(upcomingReminders);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  
  // Filter states
  const [filterOrder, setFilterOrder] = useState("all");
  const [filterGuard, setFilterGuard] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Calculate metrics
  const metrics = useMemo(() => {
    const allAssignments = scheduleData.flatMap(day => day.guards);
    const todayAssignments = scheduleData.find(day => 
      day.date.toDateString() === today.toDateString()
    )?.guards || [];
    
    return {
      activeShifts: todayAssignments.filter(g => g.status === "Active").length,
      scheduledToday: todayAssignments.length,
      totalThisWeek: allAssignments.length,
      patrolsActive: allAssignments.filter(g => g.role === "Patrol" && g.status === "Active").length
    };
  }, [scheduleData]);

  // Get assignments for selected date with filters
  const getFilteredAssignments = (date: Date) => {
    const dayData = scheduleData.find(day => 
      day.date.toDateString() === date.toDateString()
    );
    
    if (!dayData) return [];
    
    return dayData.guards.filter(assignment => {
      const matchesOrder = filterOrder === "all" || assignment.orderId === filterOrder;
      const matchesGuard = filterGuard === "all" || assignment.id === filterGuard;
      const matchesRole = filterRole === "all" || assignment.role.toLowerCase() === filterRole.toLowerCase();
      const matchesSearch = !searchTerm || 
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  const handleSaveAssignment = () => {
    const order = orderList.find(o => o.id === formData.orderId);
    
    if (formData.guardIds.length === 0 || !order) return;

    // Create assignments for each selected guard
    const newAssignments = formData.guardIds
      .map(guardId => {
        const guard = availableGuards.find(g => g.id === guardId);
        if (!guard) return null;

        return {
          id: guardId,
          name: guard.name,
          role: formData.role,
          time: `${formData.startTime}-${formData.endTime}`,
          orderId: formData.orderId,
          orderName: order.name,
          description: formData.description,
          status: "Scheduled"
        };
      })
      .filter((assignment): assignment is NonNullable<typeof assignment> => assignment !== null);

    setScheduleData(prev => {
      const dateKey = formData.date.toDateString();
      const existingDayIndex = prev.findIndex(day => day.date.toDateString() === dateKey);
      
      if (existingDayIndex >= 0) {
        const updatedDay = { ...prev[existingDayIndex] };
        updatedDay.guards = [...updatedDay.guards, ...newAssignments];
        const newData = [...prev];
        newData[existingDayIndex] = updatedDay;
        return newData;
      } else {
        return [...prev, {
          id: `SCH-${Date.now()}`,
          date: new Date(formData.date),
          guards: newAssignments
        }];
      }
    });

    setShowCreateDialog(false);
  };

  const handleDeleteAssignment = (assignmentId: string, date: Date) => {
    setScheduleData(prev => {
      return prev.map(day => {
        if (day.date.toDateString() === date.toDateString()) {
          return {
            ...day,
            guards: day.guards.filter(g => g.id !== assignmentId || g.time !== selectedAssignment?.time)
          };
        }
        return day;
      }).filter(day => day.guards.length > 0);
    });
  };

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
  
  // Helper function to get assignments for a specific day and time
  const getAssignmentsForSlot = (date: Date, timeSlot: string) => {
    const dayData = scheduleData.find(day => 
      day.date.toDateString() === date.toDateString()
    );
    
    if (!dayData) return [];
    
    return dayData.guards.filter(assignment => {
      const [startTime] = assignment.time.split('-');
      return startTime === timeSlot;
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
          <p className="text-gray-600 text-sm">Managed Assignment & Calendar View</p>
        </div>
        
        {/* Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">{metrics.activeShifts}</div>
              <div className="text-xs text-green-600">Active Now</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{metrics.scheduledToday}</div>
              <div className="text-xs text-blue-600">Today</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <User className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">{metrics.totalThisWeek}</div>
              <div className="text-xs text-purple-600">This Week</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <MapPin className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">{metrics.patrolsActive}</div>
              <div className="text-xs text-orange-600">Patrols</div>
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
              {orderList.map(order => (
                <SelectItem key={order.id} value={order.id}>{order.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGuard} onValueChange={setFilterGuard}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Guard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guards</SelectItem>
              {availableGuards.map(guard => (
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
                  <p className="text-gray-600 text-sm">
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
                    <span className="text-sm">
                      <span className="font-bold text-blue-900">{getFilteredAssignments(selectedDate).length}</span> 
                      <span className="text-gray-600 ml-1">Total Shifts</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">
                      <span className="font-bold text-orange-900">
                        {getFilteredAssignments(selectedDate).filter(a => a.role === 'Patrol').length}
                      </span> 
                      <span className="text-gray-600 ml-1">Patrol</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      <span className="font-bold text-green-900">
                        {getFilteredAssignments(selectedDate).filter(a => a.role === 'Static').length}
                      </span> 
                      <span className="text-gray-600 ml-1">Static</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">
                      <span className="font-bold text-purple-900">
                        {new Set(getFilteredAssignments(selectedDate).map(a => a.orderId)).size}
                      </span> 
                      <span className="text-gray-600 ml-1">Orders</span>
                    </span>
                  </div>
                </div>

                {/* All Shifts Displayed as Cards */}
                {getFilteredAssignments(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {Array.from(new Set(getFilteredAssignments(selectedDate).map(a => a.time.split('-')[0]))).sort().map(startTime => {
                      const shiftsAtTime = getFilteredAssignments(selectedDate).filter(a => a.time.split('-')[0] === startTime);
                      
                      return (
                        <div key={startTime} className="space-y-2">
                          <div className="flex items-center gap-2 px-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">{startTime}</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-xs text-gray-500">{shiftsAtTime.length} shift{shiftsAtTime.length > 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {shiftsAtTime.map((assignment, idx) => (
                              <div
                                key={idx}
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
                                      text-xs px-2 py-0.5
                                      ${assignment.role === 'Patrol' 
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
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-medium">{assignment.time}</span>
                                    </div>
                                  </div>

                                  {assignment.description && (
                                    <div className="text-sm text-gray-700 pt-2 border-t border-gray-300">
                                      {assignment.description}
                                    </div>
                                  )}

                                  <div className="space-y-1 pt-2 border-t border-gray-300">
                                    <div className="flex items-start gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 mt-1">
                                          <div className={`
                                            px-2 py-0.5 rounded-full text-xs font-medium
                                            ${assignment.orderId === 'o1' ? 'bg-blue-200 text-blue-900' :
                                              assignment.orderId === 'o2' ? 'bg-purple-200 text-purple-900' :
                                              assignment.orderId === 'o3' ? 'bg-cyan-200 text-cyan-900' :
                                              assignment.orderId === 'o4' ? 'bg-amber-200 text-amber-900' :
                                              assignment.orderId === 'o5' ? 'bg-pink-200 text-pink-900' :
                                              'bg-teal-200 text-teal-900'
                                            }
                                          `}>
                                            {assignment.orderName}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getStatusColor(assignment.status)}`}
                                    >
                                      {assignment.status}
                                    </Badge>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-white/50"
                                        onClick={(e:any) => {
                                          e.stopPropagation();
                                          handleEditAssignment(assignment);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                                        onClick={(e:any) => {
                                          e.stopPropagation();
                                          handleDeleteAssignment(assignment.id, selectedDate);
                                        }}
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
                    <p className="text-sm text-gray-500 mb-4">No guard assignments for this date</p>
                    <Button onClick={handleCreateAssignment} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                )}

                {/* Order Legend */}
                {getFilteredAssignments(selectedDate).length > 0 && (
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <div className="text-xs font-medium text-gray-600 mb-2">ORDER LEGEND</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(getFilteredAssignments(selectedDate).map(a => a.orderId))).map(orderId => {
                        const assignment = getFilteredAssignments(selectedDate).find(a => a.orderId === orderId);
                        return (
                          <div
                            key={orderId}
                            className={`
                              px-3 py-1 rounded-full text-xs font-medium
                              ${orderId === 'o1' ? 'bg-blue-200 text-blue-900' :
                                orderId === 'o2' ? 'bg-purple-200 text-purple-900' :
                                orderId === 'o3' ? 'bg-cyan-200 text-cyan-900' :
                                orderId === 'o4' ? 'bg-amber-200 text-amber-900' :
                                orderId === 'o5' ? 'bg-pink-200 text-pink-900' :
                                'bg-teal-200 text-teal-900'
                              }
                            `}
                          >
                            {assignment?.orderName}
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
                <p className="text-gray-600 text-sm">
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
                <div className="p-3 border-r border-gray-200 font-semibold text-gray-700 text-sm">
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
                      <div className="font-semibold text-xs">{dayName}</div>
                      <div className={`text-lg font-bold ${isSelected ? 'text-white' : isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {monthName}
                      </div>
                    </div>
                  );
                })}
              </div>

              {timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                  <div className="p-3 border-r border-gray-200 bg-gray-50">
                    <div className="font-semibold text-gray-900 text-sm">{slot.time}</div>
                    <div className="text-xs text-gray-500">{slot.label}</div>
                  </div>
                  
                  {weekDays.map((day, dayIndex) => {
                    const assignments = getAssignmentsForSlot(day, slot.time);
                    const filteredAssignments = assignments.filter(assignment => {
                      const matchesOrder = filterOrder === "all" || assignment.orderId === filterOrder;
                      const matchesGuard = filterGuard === "all" || assignment.id === filterGuard;
                      const matchesRole = filterRole === "all" || assignment.role.toLowerCase() === filterRole.toLowerCase();
                      const matchesSearch = !searchTerm || 
                        assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
                      
                      return matchesOrder && matchesGuard && matchesRole && matchesSearch;
                    });
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`
                          p-2 border-r border-gray-200 min-h-[70px] relative group cursor-pointer transition-all
                          ${day.toDateString() === selectedDate.toDateString() ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        `}
                        onClick={() => {
                          setSelectedDate(new Date(day));
                          setFormData({...formData, startTime: slot.time});
                          handleCreateAssignment();
                        }}
                      >
                        {filteredAssignments.length > 0 ? (
                          <div className="space-y-1">
                            {filteredAssignments.map((assignment, idx) => (
                              <div
                                key={idx}
                                className={`
                                  p-2 rounded-md text-xs cursor-pointer transition-all border group-hover:shadow-sm
                                  ${assignment.role === 'Patrol' 
                                    ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-900 border-orange-200 hover:from-orange-200 hover:to-orange-100' 
                                    : 'bg-gradient-to-r from-green-100 to-green-50 text-green-900 border-green-200 hover:from-green-200 hover:to-green-100'
                                  }
                                `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAssignment(assignment);
                                }}
                                title={`${assignment.name} - ${assignment.orderName}`}
                              >
                                <div className="font-medium truncate">{assignment.name}</div>
                                <div className="text-xs opacity-80 truncate">{assignment.orderName}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-1 py-0 ${getStatusColor(assignment.status)}`}
                                  >
                                    {assignment.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-gray-600 transition-colors">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="h-4 w-4 mb-1" />
                            </div>
                            <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">
                      {getFilteredAssignments(selectedDate).length} assignments
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">
                      {getFilteredAssignments(selectedDate).filter(a => a.status === 'Active').length} active
                    </span>
                  </div>
                </div>
              </div>
              
              {getFilteredAssignments(selectedDate).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getFilteredAssignments(selectedDate).slice(0, 3).map((assignment, idx) => (
                    <div
                      key={idx}
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-pointer transition-all
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
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
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
                  <div className="text-sm text-gray-600">
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
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Guard Assignment</DialogTitle>
            <DialogDescription>
              Assign guards to a shift
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="description">Assignment Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the assignment details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="assignmentDate">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date.toLocaleDateString()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date:any) => date && setFormData({...formData, date})}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Select value={formData.orderId} onValueChange={(value: string) => setFormData({...formData, orderId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {orderList.map(order => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label>Select Guards (Multiple)</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-gray-50">
                {availableGuards.map(guard => (
                  <div key={guard.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`guard-${guard.id}`}
                      checked={formData.guardIds.includes(guard.id)}
                      onCheckedChange={(checked:any) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            guardIds: [...formData.guardIds, guard.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            guardIds: formData.guardIds.filter(id => id !== guard.id)
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor={`edit-guard-${guard.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {guard.name} - {guard.roles.join(", ")} ({guard.licences.join(", ")})
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.guardIds.length} guard(s) selected
              </p>
            </div>

           <div className="col-span-2 grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="editStartTime">Start Time</Label>
    <Input
      id="editStartTime"
      type="time"
      value={formData.startTime}
      onChange={(e) =>
        setFormData({ ...formData, startTime: e.target.value })
      }
    />
  </div>

  <div>
    <Label htmlFor="editEndTime">End Time</Label>
    <Input
      id="editEndTime"
      type="time"
      value={formData.endTime}
      onChange={(e) =>
        setFormData({ ...formData, endTime: e.target.value })
      }
    />
  </div>
</div>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedAssignment) {
                  handleDeleteAssignment(selectedAssignment.id, selectedDate);
                  setShowEditDialog(false);
                }
              }}
            >
              Delete Assignment
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle update logic here
                setShowEditDialog(false);
              }}>
                Update Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}