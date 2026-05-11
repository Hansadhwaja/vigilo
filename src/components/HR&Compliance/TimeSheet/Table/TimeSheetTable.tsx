"use client";

import { useState } from "react";

import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import {
    AlertCircle,
    Building2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { TimeSheet } from "@/types";

import EditTimeSheetModal from "../Modal/EditTimeSheetModal";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useEditTimeSheetMutation } from "@/apis/schedulingAPI";

import { toast } from "sonner";

import Loader from "@/components/common/Loader";

interface TimeSheetTableProps {
    timeSheets: TimeSheet[];

    isLoading: boolean;

    isError: boolean;

    error: any;
}

const TimeSheetTable = ({
    timeSheets,
    isLoading,
    isError,
    error,
}: TimeSheetTableProps) => {

    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [editTimeSheet] = useEditTimeSheetMutation();

    const handleUpdateStatus = async ({
        id,
        status,
    }: {
        id: string;
        status: string;
    }) => {
        try {
            setUpdatingId(id);

            await editTimeSheet({
                id,
                data: {
                    approvedStatus: status,
                },
            }).unwrap();

            toast.success(
                "Status updated successfully"
            );

        } catch (error) {
            console.log(error);

            toast.error(
                "Error while updating status"
            );

        } finally {
            setUpdatingId(null);
        }
    };

    const columns: Column<
        TimeSheet & RowWithId
    >[] = [
            {
                key: "guard",
                header: "Guard",

                render: (row) => (
                    <div className="flex flex-col">

                        <span className="font-medium text-gray-900">
                            {row.guard.name}
                        </span>

                        <span className="text-xs text-gray-500 font-mono">
                            #{row.guard.id.slice(0, 8)}
                        </span>

                    </div>
                ),
            },

            {
                key: "serviceType",
                header: "Service",

                render: (row) => (
                    <Badge
                        variant="outline"
                        className="capitalize"
                    >
                        {row.serviceType}
                    </Badge>
                ),
            },

            {
                key: "date",
                header: "Date",

                render: (row) => (
                    <span className="text-sm text-gray-700">
                        {row.date}
                    </span>
                ),
            },

            {
                key: "shiftTime",
                header: "Shift Time",

                render: (row) => (
                    <div className="flex flex-col">

                        <span className="text-sm font-medium text-gray-900">
                            {row.shiftStartTime}
                            {" - "}
                            {row.shiftEndTime}
                        </span>

                    </div>
                ),
            },

            {
                key: "totalHours",
                header: "Total Hours",

                render: (row) => (
                    <span className="text-sm font-medium">
                        {row.totalHours}h
                    </span>
                ),
            },

            {
                key: "regularOvertime",
                header: "Regular / OT",

                render: (row) => (
                    <div className="flex items-center gap-2 text-sm">

                        <span className="font-medium">
                            {row.shiftTotalHours}h
                        </span>

                        <span className="text-gray-400">
                            /
                        </span>

                        <span className="font-medium text-red-700">
                            {row.overtimeHours}h OT
                        </span>

                    </div>
                ),
            },

            {
                key: "status",
                header: "Approval Status",

                render: (row) => {

                    const isCurrentUpdating =
                        updatingId === row.shiftId;

                    return (
                        <Select
                            value={row.approvedStatus}
                            disabled={isCurrentUpdating}
                            onValueChange={(value) =>
                                handleUpdateStatus({
                                    id: row.shiftId,
                                    status: value,
                                })
                            }
                        >
                            <SelectTrigger className="w-36">

                                {isCurrentUpdating ? (
                                    <div className="flex items-center justify-center w-full">
                                        <Loader className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <SelectValue placeholder="Select Status" />
                                )}

                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="pending">
                                    Pending
                                </SelectItem>

                                <SelectItem value="approved">
                                    Approved
                                </SelectItem>

                                <SelectItem value="rejected">
                                    Rejected
                                </SelectItem>

                            </SelectContent>
                        </Select>
                    );
                },
            },

            {
                key: "actions",
                header: "Actions",
                align: "center",

                render: (row) => (
                    <div className="flex items-center justify-center">

                        <EditTimeSheetModal
                            timeSheet={row}
                        />

                    </div>
                ),
            },
        ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">

                <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />

                <p className="mt-3 text-gray-600">
                    Loading timesheets...
                </p>

            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">

                <AlertCircle className="h-10 w-10 text-red-500 mb-3" />

                <p className="text-red-600 font-medium">
                    Failed to load timesheets
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    {error &&
                        "data" in error
                        ? JSON.stringify(error.data)
                        : "An error occurred"}
                </p>

            </div>
        );
    }

    if (timeSheets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">

                <Building2 className="h-10 w-10 text-gray-400 mb-3" />

                <p className="text-gray-700 font-medium">
                    No timesheets found
                </p>

            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl space-y-2">

            <DataTable
                columns={columns}
                data={timeSheets.map((t) => ({
                    ...t,
                    id: t.shiftId,
                }))}
                emptyText="No time sheets available."
            />

        </div>
    );
};

export default TimeSheetTable;