import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Clock, User, MapPin, Bell, CheckCircle, AlertTriangle, Phone, Timer, Route, Download, FileText, Users, Zap, TrendingUp, Siren, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import { availableGuards, sampleGuards } from "../data/sampleData";
import { toast } from "sonner";
import {useCreateAlarmMutation, useGetAllAlarmsQuery} from "../apis/alarmsAPI";
import {useGetAllPatrolSitesQuery} from "../apis/patrollingAPI";
import {useGetAllGuardsQuery} from "../apis/guardsApi";
import { getStatusStyle, getStatusColor } from "./../utils/statusColors";



interface AlarmsPageProps {
  alarmList: any[];
  onAssign: (alarm: any) => void;
  onResolve: (id: string) => void;
  onSelectAlarm: (alarm: any) => void;
}

// Advanced GPS-based guard assignment logic
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const findOptimalGuard = (alarmLocation: {lat: number, lng: number}, priority: string) => {
  const availableNow = sampleGuards.filter(g => 
    g.status !== "Off Duty" && 
    g.status !== "Assigned" &&
    (priority === "Critical" || g.licences.includes("VIC Sec"))
  );

  if (availableNow.length === 0) return null;

  const guardsWithDistance = availableNow.map(guard => ({
    ...guard,
    distance: calculateDistance(alarmLocation.lat, alarmLocation.lng, guard.lat, guard.lng),
    eta: Math.round(calculateDistance(alarmLocation.lat, alarmLocation.lng, guard.lat, guard.lng) * 2) // 2 min per km estimate
  }));

  // Sort by distance, then by license level
  guardsWithDistance.sort((a, b) => {
    if (priority === "Critical" && a.licences.includes("First Aid") && !b.licences.includes("First Aid")) return -1;
    if (priority === "Critical" && !a.licences.includes("First Aid") && b.licences.includes("First Aid")) return 1;
    return a.distance - b.distance;
  });

  return guardsWithDistance[0];
};

// SLA Escalation Logic
const checkSLABreach = (alarm: any) => {
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

export default function AlarmsPage({ alarmList, onAssign, onResolve, onSelectAlarm }: AlarmsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [escalatedAlarms, setEscalatedAlarms] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;


  const [createAlarm, { isLoading: isCreating }] = useCreateAlarmMutation();

  const { data } = useGetAllAlarmsQuery();

const alarms = data?.data || [];

    const { data: guardsResponse, isLoading, isError, error, isFetching } = useGetAllGuardsQuery({
      limit: itemsPerPage,
      page: currentPage,
    });
  
    const guards = guardsResponse?.data || [];
    const apiPagination = guardsResponse?.pagination;

    const { data: sitesResponse, isLoading: sitesLoading } =
  useGetAllPatrolSitesQuery({});

const sites = sitesResponse?.data || [];
  
  // Create alarm form state
  const [newAlarm, setNewAlarm] = useState({
  title: "",
  siteId: "",
  type: "",
  priority: "",
  guardIds: [] as string[],
  eta: "",
  slaTime: "",
  description: "",
  unitPrice: "",
  location: "",
});

const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeOnly = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

  // Filter alarms based on search and filters
  // const filteredAlarms = alarmList.filter(alarm => {
  //   const matchesSearch = alarm.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        alarm.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        (alarm.assigned && alarm.assigned.toLowerCase().includes(searchTerm.toLowerCase()));
  //   const matchesStatus = statusFilter === "all" || 
  //                        (statusFilter === "active" && !alarm.completed) ||
  //                        (statusFilter === "resolved" && alarm.completed);
  //   const matchesPriority = priorityFilter === "all" || alarm.priority === priorityFilter;
    
  //   return matchesSearch && matchesStatus && matchesPriority;
  // });

  // Enhanced SLA monitoring and escalation
  useEffect(() => {
    const interval = setInterval(() => {
      alarmList.forEach(alarm => {
        if (!alarm.completed) {
          const slaStatus = checkSLABreach(alarm);
          
          if (slaStatus && !escalatedAlarms.has(alarm.id)) {
            setEscalatedAlarms(prev => new Set(prev).add(alarm.id));
            
            // Create notification
            const notification = {
              id: `notif-${alarm.id}-${Date.now()}`,
              alarmId: alarm.id,
              type: slaStatus.level,
              message: slaStatus.message,
              action: slaStatus.action,
              timestamp: new Date(),
              acknowledged: false
            };
            
            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
            
            // Show toast notification
            if (slaStatus.level === "CRITICAL_BREACH") {
              toast.error(slaStatus.message, {
                description: `Alarm ${alarm.id} at ${alarm.site}`,
                action: {
                  label: "View",
                  onClick: () => handleViewDetails(alarm)
                }
              });
            } else if (slaStatus.level === "WARNING") {
              toast.warning(slaStatus.message, {
                description: `Alarm ${alarm.id} at ${alarm.site}`
              });
            }
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [alarmList, escalatedAlarms]);

  // Calculate enhanced metrics
  // const activeAlarms = alarmList.filter(a => !a.completed).length;
  // const criticalAlarms = alarmList.filter(a => !a.completed && (a.priority === "Critical" || a.priority === "High")).length;
  // const slaBreachAlarms = alarmList.filter(a => !a.completed && a.slaTargetMins && a.sinceMins > a.slaTargetMins).length;
  const averageResponseTime = alarmList.reduce((sum, alarm) => {
    if (alarm.responseTime) return sum + alarm.responseTime;
    return sum;
  }, 0) / Math.max(alarmList.filter(a => a.responseTime).length, 1);
  const resolvedToday = alarmList.filter(a => a.completed && a.completedAt && 
    new Date(a.completedAt).toDateString() === new Date().toDateString()).length;
  
  // Monthly billing metrics
  const monthlyBillingValue = alarmList
    .filter(a => a.completed && a.completedAt && 
      new Date(a.completedAt).getMonth() === new Date().getMonth())
    .reduce((sum, a) => sum + (a.unitPrice || 0), 0);

  // Pagination
  // const totalPages = Math.ceil(filteredAlarms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const formattedAlarms = alarms.map((alarm) => {
  const createdTime = new Date(alarm.createdAt).getTime();
  const now = Date.now();

  const sinceMins = Math.floor((now - createdTime) / 60000);

  const assignedGuard = alarm.guards?.length
    ? alarm.guards.map((g) => g.name).join(", ")
    : null;

  return {
    id: alarm.id,

    site: alarm.siteName || "Unknown Site",

    type: alarm.title || alarm.alarmType,

    location: alarm.specificLocation,

    priority: alarm.priority,

    sinceMins,
    createdAt: alarm.createdAt,

    slaTargetMins: alarm.slaTimeMinutes,

    assigned: assignedGuard,

    eta: alarm.etaMinutes ? `${alarm.etaMinutes} min` : null,

    status: alarm.status,

    breach: alarm.breach,

    original: alarm,
  };
});
const today = new Date();
today.setHours(0, 0, 0, 0);

const todaysAlarms = formattedAlarms.filter((alarm) => {
  const created = new Date(alarm.createdAt);
  created.setHours(0, 0, 0, 0);

  return created.getTime() === today.getTime();
});

const activeAlarms = todaysAlarms.filter(
  (alarm) => alarm.status === "ongoing"
).length;

const criticalAlarms = todaysAlarms.filter(
  (alarm) => alarm.priority?.toLowerCase() === "high"
).length;

const slaBreachAlarms = todaysAlarms.filter(
  (alarm) => alarm.breach === true
).length;


const filteredAlarms = formattedAlarms.filter((alarm) => {
  const search = searchTerm.toLowerCase();

  // SEARCH
  const matchesSearch =
    alarm.site?.toLowerCase().includes(search) ||
    alarm.type?.toLowerCase().includes(search) ||
    alarm.location?.toLowerCase().includes(search) ||
    alarm.assigned?.toLowerCase().includes(search);

  // STATUS FILTER
  let matchesStatus = true;
  if (statusFilter === "ongoing") {
    matchesStatus = alarm.status === "ongoing";
  }
  if (statusFilter === "completed") {
    matchesStatus = alarm.status === "completed" ;
  }
  if (statusFilter === "cancelled") {
    matchesStatus = alarm.status === "cancelled";
  }
  if (statusFilter === "pending") {
    matchesStatus = alarm.status === "pending";
  }
  if (statusFilter === "delayed") {
    matchesStatus = alarm.status === "delayed" ;
  }

  // PRIORITY FILTER
  let matchesPriority = true;
  if (priorityFilter !== "all") {
    matchesPriority =
      alarm.priority?.toLowerCase() === priorityFilter.toLowerCase();
  }

  return matchesSearch && matchesStatus && matchesPriority;
});

const alarmsPerPage = 5;

const totalPages = Math.ceil(filteredAlarms.length / alarmsPerPage);

const indexOfLastAlarm = currentPage * alarmsPerPage;
const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;

const currentAlarms = filteredAlarms.slice(
  indexOfFirstAlarm,
  indexOfLastAlarm
);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, statusFilter, priorityFilter]);



  const handleCreateAlarm = () => {
  setNewAlarm({
    title: "",
    siteId: "",
    type: "",
    priority: "",
    guardIds: [],
    eta: "",
    slaTime: "",
    description: "",
    unitPrice: "",
    location: "",
  });

  setShowCreateDialog(true);
};

  // Enhanced GPS-based guard assignment
  const handleSmartAssign = useCallback((alarm: any) => {
    const alarmLocation = { lat: -37.815, lng: 144.965 }; // Mock location - in real app, get from alarm data
    const optimalGuard = findOptimalGuard(alarmLocation, alarm.priority);
    
    if (optimalGuard) {
      onAssign({
        ...alarm,
        assigned: optimalGuard.name,
        assignedId: optimalGuard.id,
        eta: `${optimalGuard.eta} min`,
        assignedAt: new Date()
      });
      
      toast.success(`Guard ${optimalGuard.name} assigned to ${alarm.site}`, {
        description: `ETA: ${optimalGuard.eta} minutes (${optimalGuard.distance.toFixed(1)}km away)`
      });
      
      // Auto-notify client
      handleNotifyClient(alarm, `Guard ${optimalGuard.name} assigned - ETA ${optimalGuard.eta} minutes`);
    } else {
      toast.error("No guards available for assignment", {
        description: "All guards are currently occupied or off duty"
      });
    }
  }, [onAssign]);

  const handleResolveWithBilling = useCallback((alarm: any) => {
    // Calculate actual response time
    const responseTime = alarm.assignedAt ? 
      Math.round((new Date().getTime() - new Date(alarm.assignedAt).getTime()) / 60000) : 
      alarm.sinceMins;
    
    // Create billing record
    const billingRecord = {
      alarmId: alarm.id,
      site: alarm.site,
      monitoringCompany: alarm.monitoringCompany,
      license: alarm.license,
      unitPrice: alarm.unitPrice,
      resolvedAt: new Date(),
      responseTime: responseTime,
      withinSLA: responseTime <= alarm.slaTargetMins,
      billingMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
    };
    
    // In real app, this would be sent to billing API
    console.log("Creating billing record:", billingRecord);
    
    onResolve(alarm.id);
    
    toast.success(`Alarm ${alarm.id} resolved`, {
      description: `Response time: ${responseTime}min | Billing: ${alarm.unitPrice}`
    });
    
    // Auto-notify client of resolution
    handleNotifyClient(alarm, `Alarm resolved in ${responseTime} minutes`);
  }, [onResolve]);

  const handleNotifyClient = (alarm: any, message: string) => {
    // In real app, this would send notifications via email/SMS
    console.log(`CLIENT NOTIFICATION for ${alarm.site}: ${message}`);
    
    toast.info("Client notified", {
      description: `Notification sent to ${alarm.monitoringCompany}`
    });
  };

  const handleSaveAlarm = async () => {
  try {

    const payload = {
      title: newAlarm.title,
      alarmType: newAlarm.type,
      priority: newAlarm.priority,
      siteId: newAlarm.siteId,
      specificLocation: newAlarm.location,
      guardIds: newAlarm.guardIds,
      etaMinutes: Number(newAlarm.eta),
      slaTimeMinutes: Number(newAlarm.slaTime),
      unitPrice: Number(newAlarm.unitPrice),
      price: Number(newAlarm.unitPrice),
      description: newAlarm.description,
    };

    await createAlarm(payload).unwrap();

    toast.success("Alarm created successfully");

    setShowCreateDialog(false);

  } catch (err: any) {
    console.error(err);

    const message =
      err?.data?.message ||
      err?.error ||
      "Failed to create alarm";

    toast.error(message);
  }
};

  // Export functionality
  const handleExportData = (format: 'csv' | 'pdf') => {
    const exportData = filteredAlarms.map(alarm => ({
      'Alarm ID': alarm.id,
      'Site': alarm.site,
      'Type': alarm.type,
      'Priority': alarm.priority,
      'Status': alarm.completed ? 'Resolved' : 'Active',
      'Assigned Guard': alarm.assigned || 'Unassigned',
      'SLA Target (min)': alarm.slaTargetMins,
      'Time Since (min)': alarm.sinceMins,
      'ETA': alarm.eta || 'N/A',
      'Monitoring Company': alarm.monitoringCompany,
      'License': alarm.license,
      'Unit Price': alarm.unitPrice,
      'SLA Breach': alarm.slaTargetMins && alarm.sinceMins > alarm.slaTargetMins ? 'Yes' : 'No'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alarms-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF export would use a library like jsPDF in real implementation
      toast.info("PDF export would be generated here", {
        description: "In production, this would create a detailed PDF report"
      });
    }
    
    setShowExportDialog(false);
    toast.success(`${format.toUpperCase()} export completed`, {
      description: `${exportData.length} alarm records exported`
    });
  };

  const handleViewDetails = (alarm: any) => {
    setSelectedAlarm(alarm);
    setShowDetailsDialog(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSLAColor = (sinceMins: number, slaTargetMins: number) => {
    if (!slaTargetMins || slaTargetMins <= 0) return "text-gray-600";
    const percentage = (sinceMins / slaTargetMins) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-3">
      {/* Compact Header with Summary Cards Inline */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="mb-1">Alarm Management</h1>
          <p className="text-gray-600 text-xl">Real-time Response & Guard Assignment</p>
        </div>
        
        {/* Enhanced Inline Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <Bell className="h-4 w-4 text-red-600" />
            <div>
              <div className="font-bold text-red-700">{activeAlarms}</div>
              <div className="text-lg text-red-600">Active</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <Siren className="h-4 w-4 text-orange-600" />
            <div>
              <div className="font-bold text-orange-700">{criticalAlarms}</div>
              <div className="text-lg text-orange-600">Critical</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <Zap className="h-4 w-4 text-purple-600" />
            <div>
              <div className="font-bold text-purple-700">{slaBreachAlarms}</div>
              <div className="text-lg text-purple-600">SLA Breach</div>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Timer className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-700">{Math.round(averageResponseTime)}m</div>
              <div className="text-lg text-blue-600">Avg Response</div>
            </div>
          </div> */}
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-bold text-green-700">${monthlyBillingValue.toFixed(0)}</div>
              <div className="text-lg text-green-600">Monthly Billing</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExportDialog(true)} 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button onClick={handleCreateAlarm} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Alarm
          </Button>
        </div>
      </div>

      {/* Compact Filters Row */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
        <Filter className="h-4 w-4 text-gray-500" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
          <Input
            placeholder="Search alarms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-40 h-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setPriorityFilter("all");
            setSearchTerm("");
          }}
          className="h-8"
        >
          Clear
        </Button>
      </div>
      

      {/* Main Alarm List - Compact Layout */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Patrol Alarms</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          
          {/* Alarm List */}
          <div className="space-y-3">
            {currentAlarms.map((alarm) => (
              
              <Card key={alarm.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Alarm Info */}
                      <div className="mt-3 flex flex-col justify-between">
                        <div className="font-medium text-gray-900">{alarm.site}</div>
                        <div className="text-xl text-gray-600">{alarm.type}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-lg text-gray-600">{alarm.location || 'Location TBD'}</span>
                        </div>
                      </div>
                      
                      {/* Priority & Timing */}
                      <div className="mt-2">
                        <Badge className={getPriorityColor(alarm.priority)}>
                          {alarm.priority} Priority
                        </Badge>
                        <div>
      <p className="text-muted-foreground text-sm"></p>
      <p className="font-semibold text-base">
        Created At: {formatDateOnly(alarm.createdAt)}
      </p>
      <p className="font-semibold text-base">
        {formatTimeOnly(alarm.createdAt)}
      </p>
    </div>
                        <div className={`text-lg font-medium ${getSLAColor(alarm.sinceMins, alarm.slaTargetMins)}`}>
                          SLA: {alarm.slaTargetMins}min
                        </div>
                      </div>
                      
                      {/* Assignment */}
                      <div className="mt-4 flex flex-col justify-between">
                        {alarm.assigned ? (
                          <>
                            <div className="text-xl text-gray-900">{alarm.assigned}</div>
                            <div className="text-lg text-gray-600">ETA: {alarm.eta || 'Calculating...'}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <User className="h-3 w-3 text-green-500" />
                              <span className="text-lg text-green-600">Assigned</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-xl text-gray-500">Unassigned</div>
                        )}
                      </div>
                      
                      {/* Status & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          {alarm.status ? (
  <Badge
    style={getStatusStyle(alarm.status)}
    className="border capitalize"
  >
    {getStatusColor(alarm.status).label}
  </Badge>
) : (
  <Badge className="bg-gray-100 text-gray-600 border-gray-300">
    Undefined
  </Badge>
)}
                          {alarm.breach && (
  <div className="text-lg font-semibold text-red-600 mt-1">
    🚨 SLA Breach
  </div>
)}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(alarm)}
                            className="h-8 w-8 p-0"
                          >
                            <Bell className="h-3 w-3" />
                          </Button>
                          
                          {!alarm.status && (
                            <Button
                              size="sm"
                              onClick={() => handleResolveWithBilling(alarm)}
                              className="h-8 px-2 text-lg bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SLA Progress Bar */}
                  {!alarm.status && alarm.slaTargetMins > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-lg text-gray-600 mb-1">
                        <span>SLA Progress</span>
                        <span>{Math.round((alarm.sinceMins / alarm.slaTargetMins) * 100)}%</span>
                      </div>
                      <Progress 
                        value={Math.min((alarm.sinceMins / alarm.slaTargetMins) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compact Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alarm Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alarm Details</DialogTitle>
            <DialogDescription>
              Comprehensive alarm information and response status
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlarm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Alarm Information</h3>
                  <div className="space-y-2">
                    <div><strong>Site:</strong> {selectedAlarm.site}</div>
                    <div><strong>Type:</strong> {selectedAlarm.type}</div>
                    <div><strong>Location:</strong> {selectedAlarm.location || 'Not specified'}</div>
                    <div>
                      <strong>Priority:</strong> 
                      <Badge className={`ml-2 ${getPriorityColor(selectedAlarm.priority)}`}>
                        {selectedAlarm.priority}
                      </Badge>
                    </div>
                    <div><strong>Time Since:</strong> {selectedAlarm.sinceMins} minutes</div>
                    <div><strong>SLA Time:</strong> {selectedAlarm.slaTargetMins} minutes</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Response Status</h3>
                  <div className="space-y-2">
                    <div><strong>Status:</strong> {selectedAlarm.status}</div>
                    <div><strong>Assigned Guard:</strong> {selectedAlarm.assigned || 'Unassigned'}</div>
                    <div><strong>ETA:</strong> {selectedAlarm.eta || 'Not calculated'}</div>
                    {selectedAlarm.responseTime && (
                      <div><strong>Response Time:</strong> {selectedAlarm.responseTime} minutes</div>
                    )}
                    {selectedAlarm.completedAt && (
                      <div><strong>Resolved At:</strong> {new Date(selectedAlarm.completedAt).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>

              {selectedAlarm.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-xl text-gray-600 p-3 bg-gray-50 rounded">
                    {selectedAlarm.description}
                  </p>
                </div>
              )}

              {/* SLA Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">SLA Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xl">
                    <span>Time Elapsed:</span>
                    <span className={getSLAColor(selectedAlarm.sinceMins, selectedAlarm.slaTargetMins)}>
                      {selectedAlarm.sinceMins}m / {selectedAlarm.slaTargetMins}m
                    </span>
                  </div>
                  {selectedAlarm.slaTargetMins > 0 && (
                    <Progress 
                      value={Math.min((selectedAlarm.sinceMins / selectedAlarm.slaTargetMins) * 100, 100)} 
                      className="h-3"
                    />
                  )}
                  {selectedAlarm.slaTargetMins > 0 && selectedAlarm.sinceMins > selectedAlarm.slaTargetMins && (
                    <div className="text-xl text-red-600 font-medium">
                      ⚠️ SLA Breach: {selectedAlarm.sinceMins - selectedAlarm.slaTargetMins} minutes overdue
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Alarm Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Alarm</DialogTitle>
            <DialogDescription>
              Register a new security alarm and assign response parameters
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="title">Alarm Title</Label>
              <Input
                id="title"
                value={newAlarm.title}
                onChange={(e) => setNewAlarm({...newAlarm, title: e.target.value})}
                placeholder="Brief alarm description"
              />
            </div>
            
            <div>
  <Label htmlFor="site">Site</Label>

  <Select
    value={newAlarm.siteId}
    onValueChange={(value: string) =>
      setNewAlarm({ ...newAlarm, siteId: value })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select site" />
    </SelectTrigger>

    <SelectContent>
      {sites.map((site: any) => (
        <SelectItem key={site.id} value={site.id}>
          {site.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
            
            <div>
  <Label htmlFor="type">Alarm Type</Label>
  <Select
    value={newAlarm.type}
    onValueChange={(value: string) =>
      setNewAlarm({ ...newAlarm, type: value })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Intrusion">Intrusion</SelectItem>
      <SelectItem value="Fire">Fire Alarm</SelectItem>
      <SelectItem value="Medical">Medical Emergency</SelectItem>
      <SelectItem value="Security">Security Breach</SelectItem>
      <SelectItem value="Technical">Technical Fault</SelectItem>
      <SelectItem value="Environmental">Environmental</SelectItem>
    </SelectContent>
  </Select>
</div>

<div>
  <Label htmlFor="priority">Priority</Label>
  <Select
    value={newAlarm.priority}
    onValueChange={(value: string) =>
      setNewAlarm({ ...newAlarm, priority: value })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select priority" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="High">High</SelectItem>
      <SelectItem value="Medium">Medium</SelectItem>
      <SelectItem value="Low">Low</SelectItem>
    </SelectContent>
  </Select>
</div>

<div>
  <Label>Assigned Guards</Label>

  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select guards" />
    </SelectTrigger>

    <SelectContent className="max-h-60 overflow-y-auto">

      {guards.map((guard: any) => {
        const isSelected = newAlarm.guardIds.includes(guard.id);

        return (
          <div
            key={guard.id}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer"
            onClick={() => {
              if (isSelected) {
                setNewAlarm({
                  ...newAlarm,
                  guardIds: newAlarm.guardIds.filter((id) => id !== guard.id),
                });
              } else {
                setNewAlarm({
                  ...newAlarm,
                  guardIds: [...newAlarm.guardIds, guard.id],
                });
              }
            }}
          >
            <input type="checkbox" checked={isSelected} readOnly />

            <span>{guard.name}</span>
          </div>
        );
      })}
    </SelectContent>
  </Select>
</div>

            
            <div>
              <Label htmlFor="eta">ETA (minutes)</Label>
              <Input
                id="eta"
                type="number"
                value={newAlarm.eta}
                onChange={(e) => setNewAlarm({...newAlarm, eta: e.target.value})}
                placeholder="Expected arrival time"
              />
            </div>
            
            <div>
              <Label htmlFor="slaTime">SLA Time (minutes)</Label>
              <Input
                id="slaTime"
                type="number"
                value={newAlarm.slaTime}
                onChange={(e) => setNewAlarm({...newAlarm, slaTime: e.target.value})}
                placeholder="SLA response time"
              />
            </div>
            
            <div>
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
              <Input
                id="unitPrice"
                type="number"
                value={newAlarm.unitPrice}
                onChange={(e) => setNewAlarm({...newAlarm, unitPrice: e.target.value})}
                placeholder="Billing rate"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="location">Specific Location</Label>
              <Input
                id="location"
                value={newAlarm.location}
                onChange={(e) => setNewAlarm({...newAlarm, location: e.target.value})}
                placeholder="Exact location within site"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAlarm.description}
                onChange={(e) => setNewAlarm({...newAlarm, description: e.target.value})}
                placeholder="Detailed alarm description and context..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAlarm}
            isCreating={isCreating}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            {isCreating && <Loader2 className="animate-spin h-4 w-4" />}
              Create Alarm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Alarm Data</DialogTitle>
            <DialogDescription>
              Choose format for exporting alarm records and reports
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={() => handleExportData('csv')}
              className="flex flex-col items-center gap-2 h-20"
              variant="outline"
            >
              <FileText className="h-8 w-8" />
              <span>Export CSV</span>
            </Button>
            
            <Button
              onClick={() => handleExportData('pdf')}
              className="flex flex-col items-center gap-2 h-20"
              variant="outline"
            >
              <Download className="h-8 w-8" />
              <span>Export PDF Report</span>
            </Button>
          </div>
          
          <div className="text-xl text-gray-600">
            <p>CSV: Raw data suitable for spreadsheet analysis</p>
            <p>PDF: Formatted report with charts and summaries</p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Panel (if notifications exist) */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto z-50">
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                SLA Alerts ({notifications.filter(n => !n.acknowledged).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-2 rounded border-l-4 text-lg ${
                      notif.type === 'CRITICAL_BREACH' ? 'border-red-500 bg-red-50' :
                      notif.type === 'WARNING' ? 'border-orange-500 bg-orange-50' :
                      'border-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="font-medium">{notif.message}</div>
                    <div className="text-gray-600 text-lg mt-1">
                      Alarm {notif.alarmId} • {notif.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {notifications.length > 3 && (
                <div className="text-lg text-gray-500 mt-2 text-center">
                  +{notifications.length - 3} more alerts
                </div>
              )}
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-3 text-lg"
                onClick={() => setNotifications([])}
              >
                Clear All
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}