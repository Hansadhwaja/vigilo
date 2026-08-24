import DashboardStats from "@/components/Dashboard/DashboardStats";
import TodayStats from "@/components/Dashboard/TodayStats";
import PatrolCompletionChart from "@/components/Dashboard/Chart/PatrolCompletionChart";
import CustomHeader from "@/components/common/Header/CustomHeader";

export default function Dashboard() {
  const data = [
    { day: "Mon", total: 12 },
    { day: "Tue", total: 18 },
    { day: "Wed", total: 15 },
    { day: "Thu", total: 22 },
    { day: "Fri", total: 17 },
    { day: "Sat", total: 25 },
    { day: "Sun", total: 20 },
  ];

  return (
    <section className="space-y-6">
      <CustomHeader
        title="Dashboard"
        description="Get a real-time overview of your security operations and daily activities"
      />

      <DashboardStats
        incidentsToday={0}
        activeAlarmsCount={0}
        onDutyGuardsCount={0}
        activeShiftsCount={0}
        activeOrdersCount={0}
        activePatrolsCount={0}
      />

      <TodayStats
        summary={{
          patrols: 0,
          alarmsResolved: 0,
          guardsScheduled: 0,
        }}
      />

      <PatrolCompletionChart data={data} />
    </section>
  );
}
