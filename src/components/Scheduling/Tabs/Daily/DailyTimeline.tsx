"use client";

import { useMemo } from "react";

import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import AssignmentCard from "./AssignmentCard";
import Stat from "./Stat";

import { OrganizedAssignment } from "@/types";
import { useSchedulingData } from "../../hook/useSchedulingData";
import CreateAssignmentModal from "../../Modal/CreateAssignmentModal";

interface DailyTimelineProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const DailyTimeline = ({
    scheduling,
}: DailyTimelineProps) => {
    const {
        selectedDate,
        setSelectedDate,
        selectedDayAssignments: assignments,
    } = scheduling;

    const grouped = useMemo(() => {
        return Object.entries(
            assignments.reduce(
                (
                    acc: Record<
                        string,
                        OrganizedAssignment[]
                    >,
                    assignment
                ) => {
                    const key =
                        assignment.start;

                    if (!acc[key]) {
                        acc[key] = [];
                    }

                    acc[key].push(
                        assignment
                    );

                    return acc;
                },
                {}
            )
        ).sort(([a], [b]) =>
            a.localeCompare(b)
        );
    }, [assignments]);

    return (
        <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-0">
            {/* Header */}
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-orange-50 via-white to-sky-50 px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                            Daily Timeline
                        </CardTitle>

                        <p className="mt-1 text-sm text-slate-500">
                            {selectedDate.toLocaleDateString(
                                "en-US",
                                {
                                    weekday:
                                        "long",
                                    month:
                                        "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                const d =
                                    new Date(
                                        selectedDate
                                    );

                                d.setDate(
                                    d.getDate() -
                                    1
                                );

                                setSelectedDate(
                                    d
                                );
                            }}
                            className="rounded-xl border-slate-200 bg-white hover:bg-orange-50"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedDate(
                                    new Date()
                                );
                            }}
                            className="rounded-xl border-slate-200 bg-white px-5 font-medium hover:bg-sky-50"
                        >
                            Today
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                const d =
                                    new Date(
                                        selectedDate
                                    );

                                d.setDate(
                                    d.getDate() +
                                    1
                                );

                                setSelectedDate(
                                    d
                                );
                            }}
                            className="rounded-xl border-slate-200 bg-white hover:bg-orange-50"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-5 p-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
                    <Stat
                        label="Total"
                        value={
                            assignments.length
                        }
                        icon={<User />}
                    />

                    <Stat
                        label="Patrol"
                        value={
                            assignments.filter(
                                (a) =>
                                    a.type ===
                                    "patrol"
                            ).length
                        }
                    />

                    <Stat
                        label="Static"
                        value={
                            assignments.filter(
                                (a) =>
                                    a.type ===
                                    "static"
                            ).length
                        }
                    />

                    <Stat
                        label="Orders"
                        value={
                            new Set(
                                assignments.map(
                                    (a) =>
                                        a.orderId
                                )
                            ).size
                        }
                        icon={
                            <CalendarIcon />
                        }
                    />
                </div>

                {/* Empty State */}
                {assignments.length ===
                    0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
                        <CalendarIcon className="mb-4 size-10 text-slate-400" />

                        <h3 className="text-base font-semibold text-slate-700">
                            No assignments
                            scheduled
                        </h3>

                        <p className="mt-1 mb-4 text-sm text-slate-500">
                            There are no
                            shifts assigned
                            for this day.
                        </p>

                        <CreateAssignmentModal />
                    </div>
                ) : (
                    <div className="space-y-5">
                        {grouped.map(
                            (
                                [
                                    time,
                                    shifts,
                                ]
                            ) => (
                                <div
                                    key={
                                        time
                                    }
                                    className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4"
                                >
                                    {/* Timeline Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                            <Clock className="size-4" />

                                            {
                                                time
                                            }
                                        </div>

                                        <div className="h-px flex-1 bg-slate-200" />

                                        <p className="text-sm font-medium text-slate-500">
                                            {
                                                shifts.length
                                            }{" "}
                                            shift
                                            {shifts.length >
                                                1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>

                                    {/* Cards */}
                                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                        {shifts.map(
                                            (
                                                assignment
                                            ) => (
                                                <AssignmentCard
                                                    key={
                                                        assignment.id
                                                    }
                                                    assignment={
                                                        assignment
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DailyTimeline;