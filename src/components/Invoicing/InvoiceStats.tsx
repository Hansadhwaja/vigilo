import StatCards from "../common/StatCard/StatCards";
import {
    DollarSign,
    TrendingUp,
    Clock,
    FileText,
    AlertTriangle,
} from "lucide-react";

const InvoiceStats = () => {
    const items = [
        {
            label: "Invoiced",
            value: `$${Number(1034023).toLocaleString()}`,
            Icon: DollarSign,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Collected",
            value: `$${Number(36523).toLocaleString()}`,
            Icon: TrendingUp,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Pending",
            value: `$${Number(74023).toLocaleString()}`,
            Icon: Clock,
            color: "bg-yellow-100 text-yellow-700",
        },
        {
            label: "Records",
            value: "7",
            Icon: FileText,
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            label: "Overdue",
            value: "1",
            Icon: AlertTriangle,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={items} />;
};

export default InvoiceStats;