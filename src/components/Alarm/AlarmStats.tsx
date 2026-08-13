import { Bell, Siren, TrendingUp, Zap } from "lucide-react";

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
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Critical",
      value: summary?.critical ?? 0,
      Icon: Siren,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "SLA Breach",
      value: summary?.slaBreach ?? 0,
      Icon: Zap,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Monthly Billing",
      value: summary?.monthlyBilling ?? 0,
      Icon: TrendingUp,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return <StatCards items={stats} />;
};

export default AlarmStats;
