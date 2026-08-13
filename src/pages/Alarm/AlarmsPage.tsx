import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useExportAlarmsMutation,
  useGetAllAlarmsQuery,
} from "@/store/apis/alarmsAPI";
import CreateAlarmModal from "@/components/Alarm/Modal/CreateAlarmModal";
import CustomHeader from "@/components/common/Header/CustomHeader";
import AlarmStats from "@/components/Alarm/AlarmStats";
import AlarmSearchFilters from "@/components/Alarm/AlarmSearchFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Loader from "@/components/common/Loader";
import AlarmList from "@/components/Alarm/AlarmList";

export default function AlarmsPage() {
  const { getParam } = useQueryParams();

  const status = getParam("status", "");
  const priority = getParam("priority", "");
  const page = getParam("page", "1");
  const limit = getParam("limit", "10");
  const search = getParam("search", "");
  const debouncedSearch = useDebounce(search);

  const { data } = useGetAllAlarmsQuery({
    page,
    limit,
    status,
    priority,
    search: debouncedSearch,
  });

  const alarms = data?.data ?? [];
  const summary = data?.summary ?? {
    active: 0,
    critical: 0,
    monthlyBilling: 0,
    slaBreach: 0,
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     alarms.forEach(alarm => {
  //       if (!alarm.completed) {
  //         const slaStatus = checkSLABreach(alarm);

  //         if (slaStatus && !escalatedAlarms.has(alarm.id)) {
  //           setEscalatedAlarms(prev => new Set(prev).add(alarm.id));

  //           // Show toast notification
  //           if (slaStatus.level === "CRITICAL_BREACH") {
  //             toast.error(slaStatus.message, {
  //               description: `Alarm ${alarm.id} at ${alarm.site}`,
  //               action: {
  //                 label: "View",
  //                 onClick: () => { }
  //               }
  //             });
  //           } else if (slaStatus.level === "WARNING") {
  //             toast.warning(slaStatus.message, {
  //               description: `Alarm ${alarm.id} at ${alarm.site}`
  //             });
  //           }
  //         }
  //       }
  //     });
  //   }, 60000); // Check every minute

  //   return () => clearInterval(interval);
  // }, [alarmList, escalatedAlarms]);

  // // Enhanced GPS-based guard assignment
  // const handleSmartAssign = useCallback((alarm: any) => {
  //   const alarmLocation = { lat: -37.815, lng: 144.965 }; // Mock location - in real app, get from alarm data
  //   const optimalGuard = findOptimalGuard(alarmLocation, alarm.priority);

  //   if (optimalGuard) {
  //     onAssign({
  //       ...alarm,
  //       assigned: optimalGuard.name,
  //       assignedId: optimalGuard.id,
  //       eta: `${optimalGuard.eta} min`,
  //       assignedAt: new Date()
  //     });

  //     toast.success(`Guard ${optimalGuard.name} assigned to ${alarm.site}`, {
  //       description: `ETA: ${optimalGuard.eta} minutes (${optimalGuard.distance.toFixed(1)}km away)`
  //     });

  //     // Auto-notify client
  //     handleNotifyClient(alarm, `Guard ${optimalGuard.name} assigned - ETA ${optimalGuard.eta} minutes`);
  //   } else {
  //     toast.error("No guards available for assignment", {
  //       description: "All guards are currently occupied or off duty"
  //     });
  //   }
  // }, [onAssign]);

  // const handleResolveWithBilling = useCallback((alarm: any) => {
  //   // Calculate actual response time
  //   const responseTime = alarm.assignedAt ?
  //     Math.round((new Date().getTime() - new Date(alarm.assignedAt).getTime()) / 60000) :
  //     alarm.sinceMins;

  //   // Create billing record
  //   const billingRecord = {
  //     alarmId: alarm.id,
  //     site: alarm.site,
  //     monitoringCompany: alarm.monitoringCompany,
  //     license: alarm.license,
  //     unitPrice: alarm.unitPrice,
  //     resolvedAt: new Date(),
  //     responseTime: responseTime,
  //     withinSLA: responseTime <= alarm.slaTargetMins,
  //     billingMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
  //   };

  //   // In real app, this would be sent to billing API
  //   console.log("Creating billing record:", billingRecord);

  //   onResolve(alarm.id);

  //   toast.success(`Alarm ${alarm.id} resolved`, {
  //     description: `Response time: ${responseTime}min | Billing: ${alarm.unitPrice}`
  //   });

  //   // Auto-notify client of resolution
  //   handleNotifyClient(alarm, `Alarm resolved in ${responseTime} minutes`);
  // }, [onResolve]);

  // const handleNotifyClient = (alarm: any, message: string) => {
  //   // In real app, this would send notifications via email/SMS
  //   console.log(`CLIENT NOTIFICATION for ${alarm.site}: ${message}`);

  //   toast.info("Client notified", {
  //     description: `Notification sent to ${alarm.monitoringCompany}`
  //   });
  // };

  const [exportAlarms, { isLoading: isExporting }] = useExportAlarmsMutation();

  const handleExport = async () => {
    try {
      const blob = await exportAlarms(undefined).unwrap();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `alarms-report-${Date.now()}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Alarms Exported Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while exporting Alarms");
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      <CustomHeader
        title="Alarm Management"
        description="Real-time Response & Guard Assignment"
        others={
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader />
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                </>
              )}
            </Button>

            <CreateAlarmModal />
          </div>
        }
      />

      <AlarmStats summary={summary} />
      <AlarmSearchFilters />

      <AlarmList alarms={alarms} />
    </div>
  );
}
