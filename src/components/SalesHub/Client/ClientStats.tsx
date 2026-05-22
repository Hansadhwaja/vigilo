
import { CheckCircle, Users } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
    totalUsers: number;
    activeUsers: number;
}

const ClientStats = ({
    totalUsers,
    activeUsers,
}: Props) => {
    const stats = [
        {
            label: "Total",
            value: totalUsers,
            Icon: Users,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Active",
            value: activeUsers,
            Icon: CheckCircle,
            color: "bg-blue-100 text-blue-700",
        }
    ];

    return <StatCards items={stats} />;
};

export default ClientStats;