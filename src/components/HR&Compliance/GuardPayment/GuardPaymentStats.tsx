import StatCards from "@/components/common/StatCard/StatCards";
import { GuardPaymentSummary } from "@/store/apis/guardsApi";
import { CheckCircle, Clock, DollarSign, Loader } from "lucide-react";

interface Props {
  summary: GuardPaymentSummary;
}

const GuardPaymentStats = ({ summary }: Props) => {
  const stats = [
    {
      label: "Pending",
      value: summary?.pending ?? 0,
      Icon: Clock,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Approved",
      value: summary?.approved ?? 0,
      Icon: CheckCircle,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Processing",
      value: summary?.processing ?? 0,
      Icon: Loader,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Paid",
      value: summary?.paid ?? 0,
      Icon: DollarSign,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return <StatCards items={stats} />;
};

export default GuardPaymentStats;
