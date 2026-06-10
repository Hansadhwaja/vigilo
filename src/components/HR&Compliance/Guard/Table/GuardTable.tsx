import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import {
    Building,
    Eye,
    Mail,
    Phone,
} from "lucide-react";

import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { Guard } from "@/apis/guardsApi";

import { Badge } from "@/components/ui/badge";

interface GuardTableProps {
    page: number;
    totalPages: number;
    limit: number;

    guards: Guard[];

    isLoading: boolean;
    isError: boolean;
    error: any;

    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;
}

const GuardTable = ({
    guards,
    isLoading,
    isError,
    error,
    page = 1,
    totalPages = 1,
    limit,
    onPageChange,
    onLimitChange,
}: GuardTableProps) => {

    const columns: Column<Guard & RowWithId>[] = [
        {
            key: "name",
            header: "Guard",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                        {row.name}
                    </p>

                    <p className="text-sm font-mono text-slate-400">
                        #{row.id.slice(0, 8)}
                    </p>
                </div>
            ),
        },

        {
            key: "email",
            header: "Email",

            render: (row) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />

                    <span
                        className="text-sm text-slate-700 truncate"
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
                    <Phone className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-700">
                        {row.mobile}
                    </span>
                </div>
            ),
        },

        {
            key: "address",
            header: "Address",

            render: (row) => (
                <p
                    className="text-sm text-slate-600 line-clamp-2 max-w-60"
                    title={row.address || "—"}
                >
                    {row.address || "—"}
                </p>
            ),
        },

        {
            key: "createdAt",
            header: "Joined",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-medium text-slate-700">
                        {formatDate(row.createdAt)}
                    </p>

                    <p className="text-sm text-slate-400">
                        Member since
                    </p>
                </div>
            ),
        },

        {
            key: "actions",
            header: "Actions",
            align: "center",

            render: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <Link
                        to={`/guard-details/${row.id}`}
                        className="
                            rounded-xl border border-slate-200
                            p-2 text-slate-500 transition-all
                            hover:border-orange-200
                            hover:bg-orange-50
                            hover:text-orange-600
                        "
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={guards}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading guards..."
            emptyText="No guards found"
            emptyIcon={
                <Building className="h-10 w-10 text-slate-400" />
            }
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    );
};

export default GuardTable;