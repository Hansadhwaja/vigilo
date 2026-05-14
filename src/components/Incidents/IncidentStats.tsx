
import { AlertTriangle, Calendar, CheckCircle, Clock } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

const IncidentStats = () => {
    const stats = [
        {
            label: "Pending",
            value: 2,
            Icon: Clock,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Resolved",
            value: 4,
            Icon: CheckCircle,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "High Priority",
            value: 6,
            Icon: AlertTriangle,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Today",
            value: 2,
            Icon: Calendar,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default IncidentStats;