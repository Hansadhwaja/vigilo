import { useState, useEffect } from "react";
import { revenueStreams, liveMetrics, demoTrend } from "@/data/sampleData";
import LiveStatusHeader from "@/components/Dashboard/LiveStatusHeader";
import KPICardsList from "@/components/Dashboard/KPICardsList";
import KPIMetrics from "@/components/Dashboard/KPIMetrics";
import RevenueMetrics from "@/components/Dashboard/RevenueMetrics";
import DashboardChart from "@/components/Dashboard/Chart/DashboardChart";
import DashboardActivity from "@/components/Dashboard/DashboardActivity";
import FinancialHealthCard from "@/components/Dashboard/FinancialHealthCard";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-6">
      <LiveStatusHeader
        currentTime={currentTime}
        avgResponseTime={2}
        hourlyRevenue={liveMetrics.hourlyRevenue}
      />

      <KPICardsList
        availableGuardsCount={0}
        activeAlarmsCount={0}
        onDutyGuardsCount={0}
        activeShiftsCount={0}
        activeOrdersCount={0}
        activePatrolsCount={0}
        dailyRevenue={1000}
      />

      <KPIMetrics openIncidents={4} />

      <RevenueMetrics />

      <DashboardChart line={demoTrend} revenueStreams={revenueStreams} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <DashboardActivity currentTime={currentTime} />
        <FinancialHealthCard liveMetrics={liveMetrics} />
      </div>
    </section>
  );
}
