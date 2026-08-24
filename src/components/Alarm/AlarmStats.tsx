import {
  Bell,
  CircleCheckBig,
  Siren,
  Zap,
} from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";
import { AlarmSummary } from "@/store/apis/alarmsAPI";

interface Props {
  summary: AlarmSummary;
}

const AlarmStats = ({ summary }: Props) => {
  const stats = [
    {
      label: "Active",
      value: summary?.active ?? 0,
      Icon: Bell,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "High Priority",
      value: summary?.critical ?? 0,
      Icon: Siren,
      color: "bg-red-500/10 text-red-600",
    },
    {
      label: "SLA Breach",
      value: summary?.slaBreach ?? 0,
      Icon: Zap,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Resolved",
      value: summary?.monthlyBilling ?? 0,
      Icon: CircleCheckBig,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return <StatCards items={stats} />;
};

export default AlarmStats;