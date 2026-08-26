import { AlertTriangle, Bell, MapPinned, Users } from "lucide-react";
import StatCards from "../common/StatCard/StatCards";

interface Props {
  summary: {
    patrols: number;
    alarmsResolved: number;
    guardsScheduled: number;
    incidentsToday: number;
  };
}

const TodayStats = ({ summary }: Props) => {
  const stats = [
    {
      Icon: MapPinned,
      label: "Patrols Completed",
      value: summary.patrols,
      to: "/patrol",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      Icon: Bell,
      label: "Alarms Resolved",
      value: summary.alarmsResolved,
      to: "/alarms",
      color: "bg-blue-100 text-blue-700",
    },
    {
      Icon: Users,
      label: "Guards Scheduled",
      value: summary.guardsScheduled,
      to: "/scheduling",
      color: "bg-purple-100 text-purple-700",
    },
    {
      Icon: AlertTriangle,
      label: "Incidents Today",
      value: summary.incidentsToday,
      to: "/incidents",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Today's Overview
      </h2>

      <StatCards items={stats} />
    </div>
  );
};

export default TodayStats;
