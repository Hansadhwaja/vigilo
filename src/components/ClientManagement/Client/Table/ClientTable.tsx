import React from "react";

import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import TablePagination from "@/components/common/Table/TablePagination";

import { Button } from "@/components/ui/button";

import {
    AlertCircle,
    Building,
    Eye,
    Mail,
    Phone,
    Trash2,
} from "lucide-react";

export interface Client {
    id: string;
    name: string;
    email: string;
    mobile: string;
    address?: string;
}

interface ClientTableProps {
    page: number;
    totalPages: number;
    limit: number;

    clients: Client[];

    isLoading: boolean;
    isError: boolean;
    error: any;

    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;

}

const ClientTable = ({
    clients,
    isLoading,
    isError,
    error,

    page = 1,
    totalPages = 1,
    limit,

    onPageChange,
    onLimitChange,

}: ClientTableProps) => {
    const columns: Column<
        Client & RowWithId
    >[] = [
            {
                key: "name",
                header: "Client",

                render: (row) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {row.name}
                        </span>

                        <span className="text-xs text-gray-500 font-mono">
                            #{row.id.slice(0, 8)}
                        </span>
                    </div>
                ),
            },

            {
                key: "email",
                header: "Email",

                render: (row) => (
                    <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />

                        <span
                            className="truncate text-sm text-gray-700"
                            title={row.email}
                        >
                            {row.email}
                        </span>
                    </div>
                ),
            },

            {
                key: "mobile",
                header: "Phone",

                render: (row) => (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />

                        <span className="text-sm text-gray-700">
                            {row.mobile}
                        </span>
                    </div>
                ),
            },

            {
                key: "address",
                header: "Address",

                render: (row) => (
                    <div
                        className="truncate max-w-[250px] text-sm text-gray-600"
                        title={row.address || "—"}
                    >
                        {row.address || "—"}
                    </div>
                ),
            },

            {
                key: "actions",
                header: "Actions",
                align: "center",

                render: (row) => (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"

                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50"

                        >
                            <Trash2 className="h-4 w-4" />
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
                    Loading clients...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-3" />

                <p className="text-red-600 font-medium">
                    Failed to load clients
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    {error &&
                        "data" in error
                        ? JSON.stringify(
                            error.data
                        )
                        : "An error occurred"}
                </p>
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Building className="h-10 w-10 text-gray-400 mb-3" />

                <p className="text-gray-700 font-medium">
                    No clients found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl space-y-2">
            <DataTable
                columns={columns}
                data={clients}
                emptyText="No clients available."
            />

            <TablePagination
                currentPage={page}
                totalPages={totalPages}
                limit={limit}
                onLimitChange={
                    onLimitChange
                }
                onPageChange={
                    onPageChange
                }
            />
        </div>
    );
};

export default ClientTable;