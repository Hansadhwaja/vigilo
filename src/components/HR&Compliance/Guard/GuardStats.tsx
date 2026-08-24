import {
  BadgeCheck,
  CircleCheckBig,
  ShieldCheck,
  Users,
} from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
  totalGuards: number;
  activeGuards: number;
  joinedGuards: number;
  profileCompletion: number;
}

const GuardStats = ({
  totalGuards,
  activeGuards,
  joinedGuards,
  profileCompletion,
}: Props) => {
  const stats = [
    {
      label: "Total Guards",
      value: totalGuards ?? 0,
      Icon: Users,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Active Guards",
      value: activeGuards ?? 0,
      Icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Joined",
      value: joinedGuards ?? 0,
      Icon: BadgeCheck,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Profile Completion",
      value: profileCompletion ?? 0,
      Icon: CircleCheckBig,
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  return <StatCards items={stats} />;
};

export default GuardStats;