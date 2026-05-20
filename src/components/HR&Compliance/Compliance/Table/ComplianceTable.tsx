import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import {
    ShieldAlert,
    Eye,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Compliance {
    id: string;
    guardName: string;
    guardId: string;
    type: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
}

interface ComplianceTableProps {
    page: number;
    totalPages: number;
    limit: number;

    compliances: Compliance[];

    isLoading: boolean;
    isError?: boolean;
    error?: any;

    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high":
            return "bg-red-100 text-red-700";
        case "medium":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-green-100 text-green-700";
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-red-100 text-red-700";
    }
};

const ComplianceTable = ({
    compliances,
    isLoading,
    isError,
    error,
    page = 1,
    totalPages = 1,
    limit,
    onPageChange,
    onLimitChange,
}: ComplianceTableProps) => {

    const columns: Column<Compliance & RowWithId>[] = [
        {
            key: "guard",
            header: "Guard",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                        {row.guardName}
                    </p>

                    <p className="text-xs text-slate-400">
                        {row.guardId}
                    </p>
                </div>
            ),
        },

        {
            key: "type",
            header: "Type",

            render: (row) => (
                <p className="text-sm text-slate-700 capitalize">
                    {row.type}
                </p>
            ),
        },

        {
            key: "description",
            header: "Description",

            render: (row) => (
                <p
                    className="text-sm text-slate-700 line-clamp-2 max-w-72"
                    title={row.description}
                >
                    {row.description}
                </p>
            ),
        },

        {
            key: "dueDate",
            header: "Due Date",

            render: (row) => (
                <p className="text-sm text-slate-700">
                    {row.dueDate}
                </p>
            ),
        },

        {
            key: "priority",
            header: "Priority",

            render: (row) => (
                <Badge className={getPriorityColor(row.priority)}>
                    {row.priority}
                </Badge>
            ),
        },

        {
            key: "status",
            header: "Status",

            render: (row) => (
                <Badge className={getStatusColor(row.status)}>
                    {row.status}
                </Badge>
            ),
        },

        {
            key: "actions",
            header: "Actions",
            align: "center",

            render: () => (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="
                            h-8 w-8
                            border-slate-200
                            text-slate-500
                            hover:bg-orange-50
                            hover:text-orange-600
                            hover:border-orange-200
                        "
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={compliances}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading compliances..."
            emptyText="No compliances found"
            emptyIcon={
                <ShieldAlert className="h-10 w-10 text-slate-400" />
            }
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    );
};

export default ComplianceTable;