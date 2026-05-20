"use client";

import { Activity } from "@/apis/guardsApi";

import {
    Building,
    Calendar,
    Clock,
    ExternalLink,
    MapPin,
    ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useNavigate } from "react-router-dom";

import {
    getStatusColor,
    getStatusStyle,
} from "@/utils/statusColors";

import {
    formatDate,
    formatTime,
} from "@/lib/utils";

const GuardActivityCard = ({
    shift,
}: {
    shift: Activity;
}) => {
    const navigate = useNavigate();

    return (
        <div className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all
            hover:shadow-md
        ">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">

                <div className="space-y-2">

                    <div className="flex items-center gap-3 flex-wrap">

                        <div className="flex items-center gap-2">

                            <Building className="h-5 w-5 text-slate-500" />

                            <h3 className="text-lg font-semibold text-slate-800 capitalize">
                                {shift.order.locationName}
                            </h3>

                        </div>

                        <Badge
                            className="border px-3 py-1 text-xs font-semibold"
                            style={getStatusStyle(shift.assignmentStatus)}
                        >
                            {getStatusColor(shift.assignmentStatus).label}
                        </Badge>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                        <MapPin className="h-4 w-4 shrink-0" />

                        <span>
                            {shift.order.locationAddress}
                        </span>

                    </div>

                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        navigate(`/scheduling/${shift.shiftId}`)
                    }
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>

            </div>

            <Separator className="my-4" />

            {/* CORE INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Date
                    </p>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />

                        <p className="font-semibold text-slate-800">
                            {formatDate(shift.date)}
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Service Type
                    </p>

                    <p className="font-semibold text-slate-800 capitalize">
                        {shift.order.serviceType}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Shift Start
                    </p>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />

                        <p className="font-semibold text-slate-800">
                            {formatTime(shift.startTime)}
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                        Shift End
                    </p>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />

                        <p className="font-semibold text-slate-800">
                            {formatTime(shift.endTime)}
                        </p>
                    </div>
                </div>

            </div>

            {/* TIMESHEET */}
            <Separator className="my-4" />

            <div className="space-y-4">

                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    Timesheet
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">
                            Clock In
                        </p>

                        <p className="font-semibold text-slate-800">
                            {shift.timesheet?.clockInTime || "—"}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">
                            Clock Out
                        </p>

                        <p className="font-semibold text-slate-800">
                            {shift.timesheet?.clockOutTime || "—"}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-xs text-slate-500">
                            Total Hours
                        </p>

                        <p className="text-lg font-bold text-blue-600">
                            {(shift.timesheet?.totalHours || 0).toFixed(2)}h
                        </p>
                    </div>

                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                        <p className="text-xs text-slate-500">
                            Overtime
                        </p>

                        <p className="text-lg font-bold text-orange-600">
                            {shift.timesheet?.overtime?.hours?.toFixed(2) || "0.00"}h
                        </p>
                    </div>

                </div>

                {shift.timesheet?.overtime?.hours > 0 && (
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-medium">
                            {shift.timesheet.overtime.startTime}
                        </span>

                        <ChevronRight className="h-4 w-4" />

                        <span className="font-medium">
                            {shift.timesheet.overtime.endTime}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default GuardActivityCard;