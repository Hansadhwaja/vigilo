import StatCards from "@/components/common/StatCard/StatCards";
import { CheckCircle, Clock, DollarSign, Loader } from "lucide-react";


const GuardPaymentStats = () => {
    const stats = [
        {
            label: "Pending",
            value: 2,
            Icon: Clock,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Approved",
            value: 4,
            Icon: CheckCircle,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Processing",
            value: 3,
            Icon: Loader,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Paid",
            value: 4,
            Icon: DollarSign,
            color: "bg-orange-100 text-orange-700",
        },
        {
            label: "Total Paid",
            value: 1024.54,
            Icon: DollarSign,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default GuardPaymentStats;