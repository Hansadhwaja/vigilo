
import KPI from '../common/KPI';
import { Bell, Briefcase, Clock, DollarSign, MapPinned, Receipt, Shield, Target, Users } from 'lucide-react';
import StatCards from '../common/StatCard/StatCards';

interface KPICardsListProps {
    availableGuardsCount: number;
    activeAlarmsCount: number;
    onDutyGuardsCount: number;
    activeShiftsCount: number;
    activeOrdersCount: number;
    activePatrolsCount: number;
    dailyRevenue: number;
}

const KPICardsList = ({
    availableGuardsCount,
    activeAlarmsCount,
    onDutyGuardsCount,
    activeShiftsCount,
    activeOrdersCount,
    activePatrolsCount,
    dailyRevenue,

}: KPICardsListProps) => {
    const primaryKPIs = [
        {
            Icon: Shield,
            label: "Available Guards",
            value: availableGuardsCount,
            to: "/hr",
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            Icon: Bell,
            label: "Active Alarms",
            value: activeAlarmsCount,
            to: "/alarms",
            color: "bg-red-100 text-red-700",
        },
        {
            Icon: Users,
            label: "On Duty Guards",
            value: onDutyGuardsCount,
            to: "/hr",
            color: "bg-blue-100 text-blue-700",
        },
        {
            Icon: Clock,
            label: "Active Shifts",
            value: activeShiftsCount,
            to: "/scheduling",
            color: "bg-violet-100 text-violet-700",
        },
    ];

    const secondaryKPIs = [
        {
            Icon: Briefcase,
            label: "Active Orders",
            value: activeOrdersCount,
            to: "/clients",
            color: "bg-cyan-100 text-cyan-700",
        },
        {
            Icon: MapPinned,
            label: "Active Patrols",
            value: activePatrolsCount,
            to: "/patrol",
            color: "bg-amber-100 text-amber-700",
        },
        {
            Icon: DollarSign,
            label: "Total Revenue",
            value: `${Math.round(dailyRevenue / 1000)}k`,
            to: "/invoicing",
            color: "bg-green-100 text-green-700",
        },
        {
            Icon: Receipt,
            label: "Billing Cost",
            value: `${Math.round((dailyRevenue * 0.72) / 1000)}k`,
            to: "/invoicing",
            color: "bg-orange-100 text-orange-700",
        },
    ];
    
    return (
        <div className="space-y-4">
            <StatCards items={primaryKPIs} />
            <StatCards items={secondaryKPIs} />
        </div>
    )
}

export default KPICardsList