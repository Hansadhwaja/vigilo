"use client";

import { Activity } from "@/apis/guardsApi";

import {
    Building,
    Calendar,
    ChevronRight,
    Clock,
    ExternalLink,
    MapPin,
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
    formatDateTime,
    formatTime,
} from "@/lib/utils";

const GuardActivityCard = ({
    shift,
}: {
    shift: Activity;
}) => {
    const navigate = useNavigate();

    return (
        <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white">

            {/* Header */}
            <div className="flex items-start justify-between mb-4">

                <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                        <Building className="h-5 w-5 text-blue-600 shrink-0" />

                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                            {shift.order.locationName}
                        </h3>

                        <Badge
                            className="text-sm px-3 py-1 border-2"
                            style={getStatusStyle(
                                shift.assignmentStatus
                            )}
                        >
                            {
                                getStatusColor(
                                    shift.assignmentStatus
                                ).label
                            }
                        </Badge>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 ml-8">

                        <MapPin className="h-4 w-4 shrink-0" />

                        <span className="capitalize">
                            {shift.order.locationAddress}
                        </span>

                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        navigate(
                            `/scheduling/${shift.shiftId}`
                        )
                    }
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>

            </div>

            <Separator className="my-4" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                <div className="bg-gray-50 rounded-lg p-3 border">

                    <p className="text-sm text-gray-600 mb-1">
                        Date
                    </p>

                    <div className="flex items-center gap-2">

                        <Calendar className="h-4 w-4 text-blue-500" />

                        <span className="text-lg font-semibold">
                            {formatDate(shift.date)}
                        </span>

                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border">

                    <p className="text-sm text-gray-600 mb-1">
                        Service Type
                    </p>

                    <span className="text-lg font-semibold capitalize">
                        {shift.order.serviceType
                            .replace(/([A-Z])/g, " $1")
                            .trim()}
                    </span>

                </div>

                <div className="bg-gray-50 rounded-lg p-3 border">

                    <p className="text-sm text-gray-600 mb-1">
                        Start Time
                    </p>

                    <div className="flex items-center gap-2">

                        <Clock className="h-4 w-4 text-green-500" />

                        <span className="text-lg font-semibold">
                            {formatTime(shift.startTime)}
                        </span>

                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border">

                    <p className="text-sm text-gray-600 mb-1">
                        End Time
                    </p>

                    <div className="flex items-center gap-2">

                        <Clock className="h-4 w-4 text-red-500" />

                        <span className="text-lg font-semibold">
                            {formatTime(shift.endTime)}
                        </span>

                    </div>
                </div>
            </div>

            {/* Timesheet */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">

                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">

                    <Clock className="h-5 w-5 text-blue-600" />

                    Timesheet Details

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">

                    <div>

                        <p className="text-sm text-gray-600 mb-1">
                            Clock In
                        </p>

                        <p className="text-lg font-semibold">
                            {shift.timesheet?.clockInTime
                            }
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-600 mb-1">
                            Clock Out
                        </p>

                        <p className="text-lg font-semibold">
                            {shift.timesheet?.clockOutTime}
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-white rounded-lg p-3 border-2 border-blue-200">

                        <p className="text-sm text-gray-600 mb-1">
                            Total Hours
                        </p>

                        <p className="text-lg font-bold text-blue-600">
                            {Math.abs(
                                shift.timesheet?.totalHours || 0
                            ).toFixed(2)}
                            h
                        </p>

                    </div>

                    <div className="bg-white rounded-lg p-3 border-2 border-orange-200">

                        <p className="text-sm text-gray-600 mb-1">
                            Overtime Hours
                        </p>

                        <p className="text-lg font-bold text-orange-600">
                            {shift.timesheet?.overtime?.hours?.toFixed(
                                2
                            ) || "0.00"}
                            h
                        </p>

                    </div>

                </div>

                {shift.timesheet?.overtime &&
                    shift.timesheet.overtime.hours > 0 &&
                    shift.timesheet.overtime.startTime && (

                        <div className="mt-3 pt-3 border-t-2 border-blue-200">

                            <p className="text-sm text-gray-600 mb-2 font-medium">
                                Overtime Period
                            </p>

                            <div className="flex items-center gap-2 text-sm">

                                <span className="font-semibold">
                                    {
                                        shift.timesheet.overtime.startTime
                                    }
                                </span>

                                <ChevronRight className="h-4 w-4 text-gray-400" />

                                <span className="font-semibold">
                                    {shift.timesheet.overtime.endTime}
                                </span>

                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default GuardActivityCard;