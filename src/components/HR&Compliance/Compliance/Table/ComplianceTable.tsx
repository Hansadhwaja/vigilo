import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";
import TablePagination from "@/components/common/Table/TablePagination";
import {
    AlertCircle,
    Eye,
    ShieldAlert,
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
    page,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,

}: ComplianceTableProps) => {

    const columns: Column<Compliance & RowWithId>[] = [
        {
            key: "guard",
            header: "Guard",

            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        {row.guardName}
                    </span>

                    <span className="text-xs text-gray-500">
                        {row.guardId}
                    </span>
                </div>
            ),
        },

        {
            key: "type",
            header: "Type",
        },

        {
            key: "description",
            header: "Description",

            render: (row) => (
                <div
                    className="max-w-72 truncate text-sm text-gray-600"
                    title={row.description}
                >
                    {row.description}
                </div>
            ),
        },

        {
            key: "dueDate",
            header: "Due Date",
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

            render: (row) => (
                <div className="flex items-center justify-center gap-2">

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>

                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />

                <p className="mt-3 text-gray-600">
                    Loading compliances...
                </p>
            </div>
        );
    }


    if (compliances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShieldAlert className="h-10 w-10 text-gray-400 mb-3" />

                <p className="text-gray-700 font-medium">
                    No compliances found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl space-y-2">

            <DataTable
                columns={columns}
                data={compliances}
                emptyText="No compliances available."
            />

            <TablePagination
                currentPage={page}
                totalPages={totalPages}
                limit={limit}
                onLimitChange={onLimitChange}
                onPageChange={onPageChange}
            />

        </div>
    );
};

export default ComplianceTable;