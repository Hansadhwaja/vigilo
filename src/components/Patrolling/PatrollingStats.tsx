
import { Activity, Bell, Clock, Shield, Siren, TrendingUp, Zap } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

const PatrollingStats = () => {
    const stats = [
        {
            label: "Active",
            value: 2,
            Icon: Activity,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Pending",
            value: 4,
            Icon: Clock,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Completion",
            value: 6,
            Icon: Shield,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Daily Revenue",
            value: 2,
            Icon: TrendingUp,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default PatrollingStats;