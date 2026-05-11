import StatCards from "@/components/common/StatCard/StatCards";
import { CheckCircle, Clock } from "lucide-react";
import { Activity } from "react";

const GuardStats = ({ activity }) => {

    const totalShifts = activity.length;

    const completedShifts = activity.filter(
        (a) =>
            a.shiftStatus === "completed" ||
            a.shiftStatus === "overtime_ended"
    ).length;

    const totalHoursWorked = activity.reduce(
        (sum, a) =>
            sum + Math.abs(a.timesheet?.totalHours || 0),
        0
    );

    const totalOvertimeHours = activity.reduce(
        (sum, a) =>
            sum + (a.timesheet?.overtime?.hours || 0),
        0
    );

    const stats = [
        {
            label: "Total Shifts",
            value: totalShifts,
            Icon: Activity,
            color: "bg-green-100 text-green-700",
        },
        {
            label: "Completed",
            value: completedShifts,
            Icon: CheckCircle,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Total Hours",
            value: totalHoursWorked.toFixed(2),
            Icon: Clock,
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "Overtime",
            value: totalOvertimeHours.toFixed(2),
            Icon: Clock,
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return <StatCards items={stats} />;
};

export default GuardStats;