import {
  Bell,
  Briefcase,
  Clock,
  MapPinned,
} from "lucide-react";
import StatCards from "../common/StatCard/StatCards";

interface Props {
  activeAlarmsCount: number;
  activeShiftsCount: number;
  activeOrdersCount: number;
  activePatrolsCount: number;
}

const DashboardStats = ({
  activeAlarmsCount,
  activeShiftsCount,
  activeOrdersCount,
  activePatrolsCount,
}: Props) => {
  const stats = [
    {
      Icon: Clock,
      label: "Active Shifts",
      value: activeShiftsCount,
      to: "/scheduling",
      color: "bg-purple-100 text-purple-700",
    },
    {
      Icon: MapPinned,
      label: "Active Patrols",
      value: activePatrolsCount,
      to: "/patrol",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      Icon: Bell,
      label: "Active Alarms",
      value: activeAlarmsCount,
      to: "/alarms",
      color: "bg-red-100 text-red-700",
    },
    {
      Icon: Briefcase,
      label: "Active Orders",
      value: activeOrdersCount,
      to: "/sales",
      color: "bg-orange-100 text-orange-700",
    },
  ];
  return <StatCards items={stats} />;
};

export default DashboardStats;
