
import KPI from '../common/KPI';
import { Bell, DollarSign, Target, Users } from 'lucide-react';

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
            icon: Users,
            label: "Available Guards",
            value: availableGuardsCount,
            sub: "ready for assignment",
            to: "/hr",
        },
        {
            icon: Bell,
            label: "Active Alarms",
            value: activeAlarmsCount,
            sub: "requiring response",
            urgent: activeAlarmsCount > 2,
            to: "/alarms",
        },
        {
            icon: Users,
            label: "On Duty Guards",
            value: onDutyGuardsCount,
            sub: "currently working",
            to: "/hr",
        },
        {
            icon: Target,
            label: "Active Shifts",
            value: activeShiftsCount,
            sub: "in progress",
            to: "/scheduling",
        },
    ];

    const secondaryKPIs = [
        {
            icon: Target,
            label: "Active Orders",
            value: activeOrdersCount,
            sub: "currently running",
            to: "/clients",
        },
        {
            icon: Target,
            label: "Active Patrols",
            value: activePatrolsCount,
            sub: "currently patrolling",
            to: "/patrol",
        },
        {
            icon: DollarSign,
            label: "Total Revenue",
            value: `${Math.round(dailyRevenue / 1000)}k`,
            sub: "monthly total",
            trend: "up" as const,
            to: "/invoicing",
        },
        {
            icon: DollarSign,
            label: "Billing Cost",
            value: `${Math.round((dailyRevenue * 0.72) / 1000)}k`,
            sub: "monthly cost",
            to: "/invoicing",
        },
    ];
    return (
        <div className="space-y-4">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {primaryKPIs.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <KPI
                            key={index}
                            icon={<Icon className="h-5 w-5" />}
                            label={item.label}
                            value={item.value}
                            sub={item.sub}
                            urgent={item.urgent}
                            to={item.to}
                        />
                    )
                })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {secondaryKPIs.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <KPI
                            key={index}
                            icon={<Icon className="h-5 w-5" />}
                            label={item.label}
                            value={item.value}
                            sub={item.sub}
                            trend={item.trend}
                            to={item.to}
                        />
                    )
                })}
            </div>

        </div>
    )
}

export default KPICardsList