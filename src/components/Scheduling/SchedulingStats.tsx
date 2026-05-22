import { useMemo } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import StatCards from "../common/StatCard/StatCards";
import { useSchedulingData } from "./hook/useSchedulingData";

interface SchedulingStatsProps {
  scheduling: ReturnType<typeof useSchedulingData>;
}

const SchedulingStats = ({ scheduling }: SchedulingStatsProps) => {
  const {
    summary
  } = scheduling;

  const stats = useMemo(() => {
    return [
      {
        label: "Active Now",
        value: summary?.activeNow ?? 0,
        Icon: Clock,
        color: "bg-green-100 text-green-700",
      },
      {
        label: "Today",
        value: summary?.today ?? 0,
        Icon: Calendar,
        color: "bg-blue-100 text-blue-700",
      },
      {
        label: "This Week",
        value: summary?.thisWeek ?? 0,
        Icon: User,
        color: "bg-purple-100 text-purple-700",
      },
      {
        label: "Patrols",
        value: summary?.patrols ?? 0,
        Icon: MapPin,
        color: "bg-orange-100 text-orange-700",
      },
    ];
  }, [summary]);

  return <StatCards items={stats} />;
};

export default SchedulingStats;