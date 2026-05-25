
import { Activity, Clock, Shield, TrendingUp } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
    active: number;
    pending: number;
    completed: number;
    revenue: number;
}

const PatrollingStats = ({
    active,
    pending,
    completed,
    revenue
}: Props) => {
    const stats = [
        {
            label: "Active",
            value: active ?? 0,
            Icon: Activity,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Pending",
            value: pending ?? 0,
            Icon: Clock,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Completion",
            value: completed ?? 0,
            Icon: Shield,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Daily Revenue",
            value: revenue ?? 0,
            Icon: TrendingUp,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default PatrollingStats;