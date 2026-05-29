import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPatrolRun, useExportPatrolsMutation, useGetAllPatrolRunsForAdminQuery } from "@/apis/patrollingAPI";
import CustomHeader from "@/components/common/Header/CustomHeader";
import PatrollingStats from "@/components/Patrolling/PatrollingStats";
import PatrollingSearchFilters from "@/components/Patrolling/PatrollingSearchFilers";
import CreatePatrolModal from "@/components/Patrolling/Modal/CreatePatrolModal";
import PatrolCard from "../../components/Patrolling/PatrolCard";
import Loader from "@/components/common/Loader";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { toast } from "sonner";

export default function PatrolPage() {
  const { getParam } = useQueryParams();
  const status = getParam("status", "");
  const search = getParam("search", "");
  const page = getParam("page", "1");
  const limit = getParam("limit", "10");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching } = useGetAllPatrolRunsForAdminQuery({
    page,
    limit,
    status,
    search: debouncedSearch,
  });

  const { data: patrols = [], summary } = data ?? {};

  const [exportPatrol, { isLoading: isExporting }] = useExportPatrolsMutation();

  const handleExport = async () => {
    try {
      const blob = await exportPatrol(undefined).unwrap();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `patrol-report-${Date.now()}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Patrols Exported Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while exporting Patrols")
    }
  }

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      <CustomHeader
        title="Patrol Management"
        description="QR Scanning, Real-time Tracking & Proof of Service"
        others={
          <div className="flex justify-end gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleExport}
              disabled={isExporting}
            >

              {isExporting ? <Loader /> : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                </>


              )}
            </Button>

            <CreatePatrolModal />
          </div>
        }
      />
      <PatrollingStats
        active={summary?.active ?? 0}
        pending={summary?.pending ?? 0}
        completed={summary?.completion ?? 0}
        revenue={0}
      />
      <PatrollingSearchFilters />
      <Card className="p-0 flex flex-col gap-0">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Patrol Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading || isFetching ? <Loader /> :
            patrols.length > 0 ? (
              <div className="space-y-3">
                {patrols.map((patrol: AdminPatrolRun) => (
                  <PatrolCard key={patrol.id} patrol={patrol} />
                ))}
              </div>
            ) : (
              <p className="text-center font-semibold">No Patrol found</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}