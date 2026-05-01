import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Users,
  Bell,
  Target,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Zap,
  CreditCard,
  Check
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { demoTrend, revenueStreams, liveMetrics } from "@/data/sampleData";
// APIs
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { useGetAllSchedulesQuery } from "@/apis/schedulingAPI";
import { useGetAllOrdersQuery } from "@/apis/ordersApi";
import { useGetAllPatrolRunsForAdminQuery } from "@/apis/patrollingAPI";
import { useGetAllAlarmsQuery } from "@/apis/alarmsAPI";
import LiveStatusHeader from "@/components/Dashboard/LiveStatusHeader";
import KPICardsList from "@/components/Dashboard/KPICardsList";
import KPIMetrics from "@/components/Dashboard/KPIMetrics";
import RevenueMetrics from "@/components/Dashboard/RevenueMetrics";
import DashboardChart from "@/components/Dashboard/Chart/DashboardChart";
import DashboardActivity from "@/components/Dashboard/DashboardActivity";
import FinancialHealthCard from "@/components/Dashboard/FinancialHealthCard";

interface DashboardProps {
  kpi: {
    onDuty: number;
    openIncidents: number;
    openAlarms: number;
    patrolsDue: number;
    dailyRevenue: number;
    revenueGrowth: number;
    activeContracts: number;
    avgResponseTime: number;
  };
}

export default function Dashboard({ kpi }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: ordersResponse } = useGetAllOrdersQuery({
    limit: 5000,
    page: 1,
  });

  const allOrders = ordersResponse?.data ?? [];

  const buildDateTime = (isoDate: string | null | undefined, time: string | null | undefined) => {
    if (!isoDate || !time) return null;
    const datePart = isoDate.split("T")[0];
    return new Date(`${datePart}T${time}:00`);
  };

  const activeOrdersCount = useMemo(() => {
    const now = new Date();

    return allOrders.filter((order) => {
      if (["cancelled", "completed"].includes(order.status)) {
        return false;
      }
      // Skip if any date/time field is missing
      if (!order.startDate || !order.startTime || !order.endDate || !order.endTime) {
        return false;
      }
      const startDateTime = buildDateTime(order.startDate, order.startTime);
      const endDateTime = buildDateTime(order.endDate, order.endTime);
      if (!startDateTime || !endDateTime) return false;
      return now >= startDateTime && now <= endDateTime;
    }).length;
  }, [allOrders, currentTime]);

  const { data: guardsResponse } = useGetAllGuardsQuery({
    page: 1,
    limit: 5000,
  });

  const { data: schedulesResponse } = useGetAllSchedulesQuery();

  const allGuards = guardsResponse?.data ?? [];
  const schedules = schedulesResponse?.data ?? [];

  const {
    data: patrolResponse,
    isFetching,
  } = useGetAllPatrolRunsForAdminQuery({
    limit: 10,
  });

  const Patrols = patrolResponse?.data || [];
  const { data: alarmsResponse } = useGetAllAlarmsQuery();
  const alarms = alarmsResponse?.data || [];

  const activeAlarmsCount = useMemo(() => {
    return alarms.filter(
      (alarm: any) => String(alarm.status || "").toLowerCase() === "ongoing"
    ).length;
  }, [alarms]);

  const activeShiftsCount = useMemo(() => {
    const now = new Date();

    return schedules.filter((shift: any) => {
      // Ignore completed / cancelled
      if (["completed", "cancelled"].includes(shift.status)) {
        return false;
      }

      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);

      return now >= start && now <= end;
    }).length;
  }, [schedules, currentTime]);

  const activePatrolsCount = useMemo(() => {
    return Patrols.filter(
      (patrol: any) => String(patrol.status || "").toLowerCase() === "ongoing"
    ).length;
  }, [Patrols]);


  // Compute On Duty Guards

  const onDutyGuardIds = useMemo(() => {
    const ids = new Set<string>();

    schedules.forEach((shift: any) => {
      if (shift.status === "ongoing") {
        shift.guards?.forEach((guard: any) => {
          ids.add(guard.id);
        });
      }
    });

    return ids;
  }, [schedules]);

  const onDutyGuardsCount = onDutyGuardIds.size;

  //Compute Available Guards

  const availableGuardsCount = useMemo(() => {
    return allGuards.filter(
      (guard) => !onDutyGuardIds.has(guard.id)
    ).length;
  }, [allGuards, onDutyGuardIds]);

  const line = demoTrend;
  const pieData = [
    { name: "On-time", value: 92 },
    { name: "Late", value: 8 },
  ];
  const colors = ["#22c55e", "#ef4444"];

  // Update time every second for live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto min-w-0 min-h-0 h-full">

      <LiveStatusHeader
        currentTime={currentTime}
        avgResponseTime={kpi.avgResponseTime}
        hourlyRevenue={liveMetrics.hourlyRevenue}
      />

      <KPICardsList
        availableGuardsCount={availableGuardsCount}
        activeAlarmsCount={activeAlarmsCount}
        onDutyGuardsCount={onDutyGuardsCount}
        activeShiftsCount={activeShiftsCount}
        activeOrdersCount={activeOrdersCount}
        activePatrolsCount={activePatrolsCount}
        dailyRevenue={kpi.dailyRevenue}
      />

      <KPIMetrics openIncidents={kpi.openIncidents} />

      <RevenueMetrics />


      {/* Charts Section */}
      <DashboardChart
        line={line}
        revenueStreams={revenueStreams}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <DashboardActivity currentTime={currentTime} />
        <FinancialHealthCard liveMetrics={liveMetrics} />
      </div>
    </div>
  );
}