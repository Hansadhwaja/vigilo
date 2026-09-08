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
    highPriority: 0,
    resolved: 0,
    slaBreach: 0,
  };

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
              className="cursor-pointer"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader />
              ) : (
                <>
                  <Download />
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
