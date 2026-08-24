import {
  CalendarDays,
  CalendarCheck,
  CalendarRange,
  ClipboardList,
} from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
  summary: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

const IncidentStats = ({ summary }: Props) => {
  const stats = [
    {
      label: "Total",
      value: summary?.total ?? 0,
      Icon: ClipboardList,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Today",
      value: summary?.today ?? 0,
      Icon: CalendarCheck,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "This Week",
      value: summary?.thisWeek ?? 0,
      Icon: CalendarDays,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "This Month",
      value: summary?.thisMonth ?? 0,
      Icon: CalendarRange,
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  return <StatCards items={stats} />;
};

export default IncidentStats;