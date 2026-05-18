import { useState, useEffect, useCallback } from "react";
import { User, MapPin, Bell, CheckCircle, Download, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { sampleGuards } from "@/data/sampleData";
import { toast } from "sonner";
import { useDeleteAlarmMutation, useGetAllAlarmsQuery } from "@/apis/alarmsAPI";
import { useGetAllPatrolRunsForAdminQuery } from "@/apis/patrollingAPI";
import { getStatusStyle, getStatusColor } from "@/utils/statusColors";
import CreateAlarmModal from "../../components/Alarm/Modal/CreateAlarmModal";
import CustomHeader from "@/components/common/Header/CustomHeader";
import AlarmStats from "@/components/Alarm/AlarmStats";
import AlarmSearchFilters from "@/components/Alarm/AlarmSearchFilters";
import { checkSLABreach, formatDate, formatTime } from "@/lib/utils";

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
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findOptimalGuard = (alarmLocation: { lat: number, lng: number }, priority: string) => {
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


export default function AlarmsPage({ alarmList, onAssign, onResolve, onSelectAlarm }: AlarmsPageProps) {
  const [escalatedAlarms, setEscalatedAlarms] = useState<Set<string>>(new Set());

  const [deleteAlarm, { isLoading: isDeletingAlarm }] = useDeleteAlarmMutation();

  const { data } = useGetAllAlarmsQuery();

  const alarms = data?.data ?? [];


  useEffect(() => {
    const interval = setInterval(() => {
      alarmList.forEach(alarm => {
        if (!alarm.completed) {
          const slaStatus = checkSLABreach(alarm);

          if (slaStatus && !escalatedAlarms.has(alarm.id)) {
            setEscalatedAlarms(prev => new Set(prev).add(alarm.id));

            // Show toast notification
            if (slaStatus.level === "CRITICAL_BREACH") {
              toast.error(slaStatus.message, {
                description: `Alarm ${alarm.id} at ${alarm.site}`,
                action: {
                  label: "View",
                  onClick: () => { }
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

  const handleDeleteAlarm = async (alarmId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this alarm?");
    if (!confirmDelete) return;

    try {
      await deleteAlarm(alarmId).unwrap();
      toast.success("Alarm deleted successfully");
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Failed to delete alarm";
      toast.error(message);
    }
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
      <CustomHeader
        title="Alarm Management"
        description="Real-time Response & Guard Assignment"
        others={
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            <CreateAlarmModal />
          </div>
        }
      />

      <AlarmStats />
      <AlarmSearchFilters />

      <Card className="p-0">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Patrol Alarms</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            {alarms.map((alarm) => (
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
                            Created At: {formatDate(alarm.createdAt)}
                          </p>
                          <p className="font-semibold text-base">
                            {formatTime(alarm.createdAt)}
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

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAlarm(alarm.id)}
                            disabled={isDeletingAlarm}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}