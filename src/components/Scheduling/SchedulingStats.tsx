import { useMemo } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { OrganizedShifts } from "@/types";
import StatCards from "../common/StatCard/StatCards";

interface Props {
  organizedShifts: OrganizedShifts;
  today: Date;
}

const SchedulingStats = ({ organizedShifts, today }: Props) => {
  const stats = useMemo(() => {
    const allAssignments = Object.values(organizedShifts)
      .flatMap((slots: any) => Object.values(slots).flat());

    const todayKey = today.toISOString().split("T")[0];
    const todayAssignments = Object.values(
      organizedShifts[todayKey] || {}
    ).flat();

    return [
      {
        label: "Active Now",
        value: todayAssignments.filter((a: any) => a.status === "active").length,
        Icon: Clock,
        color: "bg-green-100 text-green-700",
      },
      {
        label: "Today",
        value: todayAssignments.length,
        Icon: Calendar,
        color: "bg-blue-100 text-blue-700",
      },
      {
        label: "This Week",
        value: allAssignments.length,
        Icon: User,
        color: "bg-purple-100 text-purple-700",
      },
      {
        label: "Patrols",
        value: allAssignments.filter(
          (a: any) => a.type === "patrol" && a.status === "active"
        ).length,
        Icon: MapPin,
        color: "bg-orange-100 text-orange-700",
      },
    ];
  }, [organizedShifts, today]);

  return <StatCards items={stats} />;
};

export default SchedulingStats;