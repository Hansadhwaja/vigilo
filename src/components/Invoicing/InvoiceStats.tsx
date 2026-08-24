import StatCards from "../common/StatCard/StatCards";
import {
  CircleCheckBig,
  Clock3,
  FileText,
  AlertTriangle,
} from "lucide-react";

const InvoiceStats = () => {
  const items = [
    {
      label: "Sent",
      value: `$${Number(1034023).toLocaleString()}`,
      Icon: FileText,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Pending",
      value: `$${Number(36523).toLocaleString()}`,
      Icon: Clock3,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Paid",
      value: `$${Number(74023).toLocaleString()}`,
      Icon: CircleCheckBig,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Overdue",
      value: "1",
      Icon: AlertTriangle,
      color: "bg-red-500/10 text-red-600",
    },
  ];

  return <StatCards items={items} />;
};

export default InvoiceStats;