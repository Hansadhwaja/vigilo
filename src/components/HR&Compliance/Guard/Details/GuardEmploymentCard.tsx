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

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

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
            ? Math.round(
                (completedShifts / totalShifts) * 100
            )
            : 0;

    const totalHoursWorked = activity.reduce(
        (sum, a) =>
            sum + Math.abs(a.timesheet?.totalHours || 0),
        0
    );

    return (
        <Card className="border-2 border-gray-200 shadow-sm bg-white">

            <CardHeader className="border-b-2 border-gray-200 pb-4">

                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">

                    <ShieldCheck className="h-6 w-6" />

                    Employment Details

                </CardTitle>

            </CardHeader>

            <CardContent className="p-6 space-y-5">

                {/* Joined Date */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">

                        <Calendar className="h-4 w-4" />

                        Joined Date

                    </div>

                    <p className="text-lg font-semibold text-gray-900">
                        {formatDate(guard.createdAt)}
                    </p>

                </div>

                <Separator />

                {/* Guard ID */}
                <div className="space-y-2">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">

                        <IdCard className="h-4 w-4" />

                        Guard ID

                    </div>

                    <p className="text-sm font-mono break-all text-gray-700 leading-relaxed">
                        {guard.id}
                    </p>

                </div>

                <Separator />

                {/* Shift Summary */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-gray-700">

                            <ActivityIcon className="h-4 w-4" />

                            <span className="font-medium">
                                Total Shifts
                            </span>

                        </div>

                        <Badge variant="secondary">
                            {totalShifts}
                        </Badge>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-gray-700">

                            <CheckCircle className="h-4 w-4 text-green-600" />

                            <span className="font-medium">
                                Completed Shifts
                            </span>

                        </div>

                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                            {completedShifts}
                        </Badge>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-gray-700">

                            <Clock className="h-4 w-4 text-blue-600" />

                            <span className="font-medium">
                                Total Hours Worked
                            </span>

                        </div>

                        <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                            {totalHoursWorked.toFixed(2)}h
                        </Badge>

                    </div>

                </div>

                <Separator />

                {/* Completion Rate */}
                <div className="space-y-3">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-gray-700">
                            Completion Rate
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                            {completionRate}%
                        </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{
                                width: `${completionRate}%`,
                            }}
                        />

                    </div>

                    <p className="text-xs text-gray-500">
                        {completedShifts} of {totalShifts} shifts completed
                    </p>

                </div>

            </CardContent>
        </Card>
    );
};

export default GuardEmploymentCard;