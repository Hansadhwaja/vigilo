import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllPatrolRunsForAdminQuery } from "@/apis/patrollingAPI";
import CustomHeader from "@/components/common/Header/CustomHeader";
import PatrollingStats from "@/components/Patrolling/PatrollingStats";
import PatrollingSearchFilters from "@/components/Patrolling/PatrollingSearchFilers";
import CreatePatrolModal from "@/components/Patrolling/Modal/CreatePatrolModal";
import PatrolCard from "../../components/Patrolling/PatrolCard";
import Loader from "@/components/common/Loader";

export default function PatrolPage() {

  const { data, isLoading } = useGetAllPatrolRunsForAdminQuery({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const patrols = data?.data ?? []

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
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            <CreatePatrolModal />
          </div>
        }
      />
      <PatrollingStats />
      <PatrollingSearchFilters />
      <Card className="p-0 flex flex-col gap-0">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Patrol Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? <Loader /> : (
            <div className="space-y-3">
              {patrols.map((patrol) => (
                <PatrolCard key={patrol.id} patrol={patrol} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}