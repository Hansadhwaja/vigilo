import { useMemo } from "react";
import {
  CalendarCheck,
  CalendarDays,
  CircleCheckBig,
  Radio,
} from "lucide-react";
import StatCards from "../common/StatCard/StatCards";
import { useSchedulingData } from "./hook/useSchedulingData";

interface SchedulingStatsProps {
  scheduling: ReturnType<typeof useSchedulingData>;
}

const SchedulingStats = ({ scheduling }: SchedulingStatsProps) => {
  const { summary } = scheduling;

  const stats = useMemo(() => {
    return [
      {
        label: "Active Now",
        value: summary?.activeNow ?? 0,
        Icon: Radio,
        color: "bg-emerald-500/10 text-emerald-600",
      },
      {
        label: "Today",
        value: summary?.today ?? 0,
        Icon: CalendarCheck,
        color: "bg-blue-500/10 text-blue-600",
      },
      {
        label: "Upcoming",
        value: summary?.thisWeek ?? 0,
        Icon: CalendarDays,
        color: "bg-violet-500/10 text-violet-600",
      },
      {
        label: "Completed",
        value: summary?.patrols ?? 0,
        Icon: CircleCheckBig,
        color: "bg-green-500/10 text-green-600",
      },
    ];
  }, [summary]);

  return <StatCards items={stats} />;
};

export default SchedulingStats;