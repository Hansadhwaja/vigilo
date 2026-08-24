import {
  AlertTriangle,
  Bell,
  Briefcase,
  Clock,
  DollarSign,
  MapPinned,
  Users,
} from "lucide-react";
import StatCards from "../common/StatCard/StatCards";

interface Props {
  activeAlarmsCount: number;
  onDutyGuardsCount: number;
  activeShiftsCount: number;
  activeOrdersCount: number;
  activePatrolsCount: number;
  incidentsToday: number;
}

const DashboardStats = ({
  activeAlarmsCount,
  onDutyGuardsCount,
  activeShiftsCount,
  activeOrdersCount,
  activePatrolsCount,
  incidentsToday,
}: Props) => {
  const stats = [
    {
      Icon: Users,
      label: "On Duty Guards",
      value: onDutyGuardsCount,
      to: "/hr",
      color: "bg-blue-100 text-blue-700",
    },
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
      to: "/clients",
      color: "bg-orange-100 text-orange-700",
    },
    {
      Icon: AlertTriangle,
      label: "Incidents Today",
      value: incidentsToday,
      to: "/incidents",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];
  return <StatCards items={stats} />;
};

export default DashboardStats;
