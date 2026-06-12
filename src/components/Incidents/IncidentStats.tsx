import { AlertTriangle, Calendar, CheckCircle, Clock } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
  summary: {
    highPriority: number;
    pending: number;
    resolved: number;
    today: number;
  };
}

const IncidentStats = ({ summary }: Props) => {
  const stats = [
    {
      label: "Pending",
      value: summary?.pending ?? 0,
      Icon: Clock,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Resolved",
      value: summary?.resolved ?? 0,
      Icon: CheckCircle,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "High Priority",
      value: summary?.highPriority ?? 0,
      Icon: AlertTriangle,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Today",
      value: summary?.today ?? 0,
      Icon: Calendar,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return <StatCards items={stats} />;
};

export default IncidentStats;
