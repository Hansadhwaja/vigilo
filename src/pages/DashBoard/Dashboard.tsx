import DashboardStats from "@/components/Dashboard/DashboardStats";
import TodayStats from "@/components/Dashboard/TodayStats";
import PatrolCompletionChart from "@/components/Dashboard/Chart/PatrolCompletionChart";
import CustomHeader from "@/components/common/Header/CustomHeader";
import { useGetDashboardMetricsQuery } from "@/store/apis/dashboardApis";
import DashboardSkeleton from "@/components/Dashboard/Skeleton/DashboardSkeleton";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const dashboardData = data?.data;
  const patrolCompletionsLast7Days =
    dashboardData?.patrolCompletionsLast7Days ?? [];

  return (
    <section className="space-y-6">
      <CustomHeader
        title="Dashboard"
        description="Get a real-time overview of your security operations and daily activities"
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <DashboardStats
            activeAlarmsCount={dashboardData?.activeAlarms ?? 0}
            activeShiftsCount={dashboardData?.activeShifts ?? 0}
            activeOrdersCount={dashboardData?.activeOrders ?? 0}
            activePatrolsCount={dashboardData?.activePatrols ?? 0}
          />

          <TodayStats
            summary={{
              patrols: dashboardData?.patrolsCompletedToday ?? 0,
              alarmsResolved: dashboardData?.alarmsResolvedToday ?? 0,
              guardsScheduled: dashboardData?.onDutyGuards ?? 0,
              incidentsToday: dashboardData?.incidentsToday ?? 0,
            }}
          />

          <PatrolCompletionChart data={patrolCompletionsLast7Days} />
        </>
      )}
    </section>
  );
}
