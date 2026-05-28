import StatCards from "@/components/common/StatCard/StatCards";
import {
    Car,
    Fuel,
    Wrench,
    CheckCircle,
} from "lucide-react";

const VehicleStats = () => {
    const items = [
        {
            label: "Total Vehicles",
            value: 3,
            Icon: Car,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Active Vehicles",
            value: 3,
            Icon: CheckCircle,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "In Maintenance",
            value: 1,
            Icon: Wrench,
            color: "bg-amber-100 text-amber-700",
        },
        {
            label: "Avg Fuel / Month",
            value: "782L",
            Icon: Fuel,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={items} />;
};

export default VehicleStats;