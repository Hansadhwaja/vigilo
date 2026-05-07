
import { Building, Building2, CheckCircle, DollarSign } from "lucide-react";

import StatCards from "@/components/common/StatCard/StatCards";

interface Props {
    totalOrders: number;
    activeOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
}

const OrderStats = ({
    totalOrders,
    activeOrders,
    totalRevenue,
    avgOrderValue
}: Props) => {
    const stats = [
        {
            label: "Total",
            value: totalOrders,
            Icon: Building,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Active",
            value: activeOrders,
            Icon: CheckCircle,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Estimated",
            value: totalRevenue,
            Icon: DollarSign,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Avg Value",
            value: avgOrderValue,
            Icon: Building2,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default OrderStats;