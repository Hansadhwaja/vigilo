"use client";

import { useState } from "react";

import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import {
    TimeSheet,
} from "@/types";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import {
    useEditTimeSheetMutation,
} from "@/apis/schedulingAPI";

import EditTimeSheetModal from "../Modal/EditTimeSheetModal";
import Loader from "@/components/common/Loader";

interface TimeSheetTableProps {
    timeSheets: TimeSheet[];
    page: number;
    totalPages: number;
    limit: number;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;
}

const TimeSheetTable = ({
    timeSheets,
    isLoading,
    isError,
    error,
    page = 1,
    totalPages = 1,
    limit,
    onPageChange,
    onLimitChange,
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
                data: { approvedStatus: status },
            }).unwrap();

            toast.success("Status updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while updating status");
        } finally {
            setUpdatingId(null);
        }
    };

    const columns: Column<TimeSheet & RowWithId>[] = [
        {
            key: "guard",
            header: "Guard",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                        {row.guard.name}
                    </p>

                    <p className="text-sm font-mono text-slate-400">
                        #{row.guard.id.slice(0, 8)}
                    </p>
                </div>
            ),
        },

        {
            key: "serviceType",
            header: "Service",

            render: (row) => (
                <Badge variant="outline" className="capitalize">
                    {row.serviceType}
                </Badge>
            ),
        },

        {
            key: "date",
            header: "Date",

            render: (row) => (
                <p className="text-sm text-slate-700">
                    {row.date}
                </p>
            ),
        },

        {
            key: "shiftTime",
            header: "Shift Time",

            render: (row) => (
                <p className="text-sm font-medium text-slate-800">
                    {row.shiftStartTime} - {row.shiftEndTime}
                </p>
            ),
        },

        {
            key: "totalHours",
            header: "Hours",

            render: (row) => (
                <p className="font-medium text-slate-800">
                    {row.totalHours}h
                </p>
            ),
        },

        {
            key: "overtime",
            header: "Regular / OT",

            render: (row) => (
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-800">
                        {row.shiftTotalHours.toFixed(2)}h
                    </span>

                    <span className="text-slate-400">/</span>

                    <span className="font-medium text-red-600">
                        {row.overtimeHours.toFixed(2)}h OT
                    </span>
                </div>
            ),
        },

        {
            key: "status",
            header: "Approval",

            render: (row) => {
                const isUpdating = updatingId === row.shiftId;

                return (
                    <Select
                        value={row.approvedStatus}
                        disabled={isUpdating}
                        onValueChange={(value) =>
                            handleUpdateStatus({
                                id: row.shiftId,
                                status: value,
                            })
                        }
                    >
                        <SelectTrigger className="w-36">

                            {isUpdating ? (
                                <div className="flex justify-center w-full">
                                    <Loader className="h-4 w-4" />
                                </div>
                            ) : (
                                <SelectValue placeholder="Select" />
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
                <div className="flex justify-center">
                    <EditTimeSheetModal timeSheet={row} />
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={timeSheets.map((t) => ({
                ...t,
                id: t.shiftId,
            }))}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading timesheets..."
            emptyText="No timesheets found"
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    );
};

export default TimeSheetTable;