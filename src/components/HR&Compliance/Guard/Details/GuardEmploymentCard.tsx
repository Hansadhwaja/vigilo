"use client";

import {
    Activity,
    Guard,
} from "@/apis/guardsApi";

import {
    Activity as ActivityIcon,
    Calendar,
    CheckCircle,
    Clock,
    IdCard,
    ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import SectionCard from "@/components/common/Card/SectionCard";

import { formatDate } from "@/lib/utils";

const GuardEmploymentCard = ({
    guard,
    activity,
}: {
    guard: Guard;
    activity: Activity[];
}) => {
    const totalShifts = activity.length;

    const completedShifts = activity.filter(
        (a) =>
            a.shiftStatus === "completed" ||
            a.shiftStatus === "overtime_ended"
    ).length;

    const completionRate =
        totalShifts > 0
            ? Math.round((completedShifts / totalShifts) * 100)
            : 0;

    const totalHoursWorked = activity.reduce(
        (sum, a) =>
            sum + Math.abs(a.timesheet?.totalHours || 0),
        0
    );

    return (
        <SectionCard
            title="Employment Details"
            icon={<ShieldCheck className="h-5 w-5" />}
        >
            <div className="space-y-6">

                {/* HERO */}
                <div className="
                    relative overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-gradient-to-br
                    from-slate-50
                    to-white
                    p-5
                ">
                    <p className="text-sm text-slate-500">
                        Guard Employment Overview
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-slate-800">
                        Performance & Work Summary
                    </h3>
                </div>

                {/* JOINED + ID */}
                <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            Joined Date
                        </div>

                        <p className="mt-2 text-lg font-semibold text-slate-800">
                            {formatDate(guard.createdAt)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <IdCard className="h-4 w-4" />
                            Guard ID
                        </div>

                        <p className="mt-2 text-sm font-mono text-slate-700 break-all">
                            {guard.id}
                        </p>
                    </div>

                </div>

                <Separator className="bg-slate-200" />

                {/* STATS */}
                <div className="grid gap-4">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                            <ActivityIcon className="h-4 w-4" />
                            Total Shifts
                        </div>

                        <Badge variant="secondary">
                            {totalShifts}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Completed Shifts
                        </div>

                        <Badge className="bg-green-100 text-green-700 border-0">
                            {completedShifts}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Total Hours Worked
                        </div>

                        <Badge className="bg-blue-100 text-blue-700 border-0">
                            {totalHoursWorked.toFixed(2)}h
                        </Badge>
                    </div>

                </div>

                <Separator className="bg-slate-200" />

                {/* PROGRESS */}
                <div className="space-y-3">

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                            Completion Rate
                        </span>

                        <span className="text-sm font-semibold text-slate-800">
                            {completionRate}%
                        </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>

                    <p className="text-xs text-slate-500">
                        {completedShifts} of {totalShifts} shifts completed
                    </p>

                </div>

            </div>
        </SectionCard>
    );
};

export default GuardEmploymentCard;