import { InvoiceSummary } from "@/types";
import StatCards from "../common/StatCard/StatCards";
import { CircleCheckBig, Clock3, FileText, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  summary: InvoiceSummary;
}

const InvoiceStats = ({ summary }: Props) => {
  const items = [
    {
      label: "Sent",
      value: formatCurrency(summary?.sent?.totalAmount ?? 0),
      Icon: FileText,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Pending",
      value: formatCurrency(summary?.pending?.totalAmount ?? 0),
      Icon: Clock3,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Paid",
      value: formatCurrency(summary?.paid?.totalAmount ?? 0),
      Icon: CircleCheckBig,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Overdue",
      value: formatCurrency(summary?.overdue?.totalAmount ?? 0),
      Icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600",
    },
  ];

  return <StatCards items={items} />;
};

export default InvoiceStats;
