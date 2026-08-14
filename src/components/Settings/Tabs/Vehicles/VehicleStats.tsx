import StatCards from "@/components/common/StatCard/StatCards";
import { VehicleStatType } from "@/types/vehicle";
import { Car, CircleOff, Wrench } from "lucide-react";

interface Props {
  stats: VehicleStatType;
}

const VehicleStats = ({ stats }: Props) => {
  const items = [
    {
      label: "Active",
      value: stats.active,
      Icon: Car,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      Icon: CircleOff,
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: "In Maintenance",
      value: stats.maintenance,
      Icon: Wrench,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return <StatCards items={items} />;
};

export default VehicleStats;
