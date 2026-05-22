import { IncidentType } from "@/apis/incidentsApi";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface IncidentsTableProps {
    incidents: IncidentType[];
    page: number;
    totalPages: number;
    limit: number;

    isLoading: boolean;
    isError?: boolean;
    error?: any;

    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;
}

const IncidentsTable = ({
    incidents,
    isLoading,
    isError,
    error,
    page = 1,
    totalPages = 1,
    limit,
    onPageChange,
    onLimitChange,
}: IncidentsTableProps) => {

    const columns: Column<IncidentType & RowWithId>[] = [
        {
            key: "name",
            header: "Name",

            render: (row) => (
                <p className="font-semibold text-slate-800 truncate w-32">
                    {row.name}
                </p>
            ),
        },

        {
            key: "location",
            header: "Location",

            render: (row) => (
                <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />

                    <span className="line-clamp-2 w-40 uppercase text-sm truncate font-semibold">
                        {row.location}
                    </span>
                </div>
            ),
        },

        {
            key: "description",
            header: "Description",

            render: (row) => (
                <p className="text-sm text-slate-700 line-clamp-2 max-w-xs truncate">
                    {row.description}
                </p>
            ),
        },

        {
            key: "reporter",
            header: "Reported By",

            render: (row) => (
                <div className="flex items-center gap-2">
                    <UserAvatar
                        src=""
                        name={row.reporter?.name || "Unknown"}
                    />

                    <p className="text-sm font-medium text-slate-800">
                        {row.reporter?.name || "Unknown"}
                    </p>
                </div>
            ),
        },

        {
            key: "createdAt",
            header: "Date/Time",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-medium text-slate-700">
                        {formatDate(row.createdAt)}
                    </p>

                    <p className="text-xs text-slate-400">
                        {formatTime(row.createdAt)}
                    </p>
                </div>
            ),
        },

        {
            key: "actions",
            header: "Actions",
            align: "center",

            render: (row) => (
                <div className="flex justify-center">
                    <Link
                        to={`/incidents/${row.id}`}
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
            data={incidents}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading incidents..."
            emptyText="No incidents found"
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
        />
    );
};

export default IncidentsTable;