import {
  ClipboardList,
  CircleCheckBig,
  Clock3,
  LoaderCircle,
  Radio,
} from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
  totalOrders: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

const OrderStats = ({
  totalOrders,
  activeOrders,
  pendingOrders,
  completedOrders,
}: Props) => {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      Icon: ClipboardList,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Active",
      value: activeOrders,
      Icon: Radio,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Pending",
      value: pendingOrders ?? 0,
      Icon: Clock3,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Completed",
      value: completedOrders ?? 0,
      Icon: CircleCheckBig,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return <StatCards items={stats} />;
};

export default OrderStats;
