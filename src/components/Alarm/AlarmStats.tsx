
import { Bell, Siren, TrendingUp, Zap } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

const AlarmStats = () => {
    const stats = [
        {
            label: "Active",
            value: 2,
            Icon: Bell,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Critical",
            value: 4,
            Icon: Siren,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "SLA Breach",
            value: 6,
            Icon: Zap,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Monthly Billing",
            value: 2,
            Icon: TrendingUp,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default AlarmStats;