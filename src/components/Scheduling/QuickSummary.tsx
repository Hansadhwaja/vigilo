import { OrganizedAssignment } from "@/types";

import { Calendar, Clock, User, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ShiftPill from "./ShiftPill";
import StatCards from "../common/StatCard/StatCards";

import { useSchedulingData } from "./hook/useSchedulingData";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Button } from "../ui/button";

interface QuickSummaryProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const QuickSummary = ({ scheduling }: QuickSummaryProps) => {
    const { setParam } = useQueryParams();

    const handleRedirect = () => {
        setParam("tab", "daily");
    };

    const { selectedDate, selectedDayAssignments: assignments } = scheduling;

    const activeAssignments = assignments.filter(
        (assignment: OrganizedAssignment) =>
            assignment.status?.toLowerCase() === "active"
    );

    const completedAssignments = assignments.filter(
        (assignment: OrganizedAssignment) =>
            assignment.status?.toLowerCase() === "completed"
    );

    const stats = [
        {
            label: "Total",
            Icon: User,
            value: assignments.length,
            color:
                "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300",
        },
        {
            label: "Active",
            Icon: Clock,
            value: activeAssignments.length,
            color:
                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300",
        },
        {
            label: "Completed",
            Icon: ShieldCheck,
            value: completedAssignments.length,
            color:
                "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
        },
    ];

    return (
        <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm p-0">
            <div className="h-1.5 w-full bg-linear-to-r from-orange-500 via-orange-400 to-sky-500" />

            <CardContent className="space-y-4 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* Date Info */}
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-sky-100 shadow-inner">
                            <Calendar className="size-6 text-orange-600" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                                {selectedDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </h3>

                            <p className="text-sm text-slate-500">
                                Schedule overview for{" "}
                                <span className="font-medium text-slate-700">
                                    {selectedDate.getFullYear()}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-start flex-1">
                        <StatCards items={stats} />
                    </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* Assignments */}
                {assignments.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
                                Assigned Shifts
                            </h4>

                            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
                                {assignments.length} Assignments
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {assignments
                                .slice(0, 4)
                                .map((assignment: OrganizedAssignment) => (
                                    <div
                                        key={assignment.id}
                                        className="rounded-2xl border border-slate-200/70 bg-linear-to-br from-white to-slate-50 p-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <ShiftPill assignment={assignment} />
                                    </div>
                                ))}

                            {assignments.length > 4 && (
                                <Button variant="ghost" onClick={handleRedirect} className="flex min-h-[80px] items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 text-center transition-all hover:border-orange-300 hover:bg-orange-50">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-orange-600">
                                            +{assignments.length - 4}
                                        </p>

                                        <p className="text-sm font-medium text-slate-600">
                                            More Assignments
                                        </p>
                                    </div>
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 py-10 text-center">
                        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                            <Calendar className="size-6 text-slate-400" />
                        </div>

                        <h4 className="text-sm font-semibold text-slate-700">
                            No Assignments Found
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no shifts scheduled for this date.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default QuickSummary;