
import { AlertCircle, Shield, User } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
    totalGuards: number;
    activeGuards: number;
    totalIssues: number;
}

const GuardStats = ({
    totalGuards,
    activeGuards,
    totalIssues
}: Props) => {
    const stats = [
        {
            label: "Total",
            value: totalGuards,
            Icon: User,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Active Guards",
            value: activeGuards,
            Icon: Shield,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Issues",
            value: totalIssues,
            Icon: AlertCircle,
            color: "bg-purple-100 text-purple-700",
        }
    ];

    return <StatCards items={stats} />;
};

export default GuardStats;