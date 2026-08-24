import { Activity, Clock3, CalendarClock, CircleCheckBig } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
  active: number;
  pending: number;
  completed: number;
  revenue: number;
}

const PatrollingStats = ({ active, pending, completed, revenue }: Props) => {
  const stats = [
    {
      label: "Active",
      value: active ?? 0,
      Icon: Activity,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Pending",
      value: pending ?? 0,
      Icon: Clock3,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Upcoming",
      value: revenue ?? 0,
      Icon: CalendarClock,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Completed",
      value: completed ?? 0,
      Icon: CircleCheckBig,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return <StatCards items={stats} />;
};

export default PatrollingStats;
