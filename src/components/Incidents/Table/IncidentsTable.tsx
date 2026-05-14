import { IncidentType } from "@/apis/incidentsApi";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
import Loader from "@/components/common/Loader";
import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";
import TablePagination from "@/components/common/Table/TablePagination";

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
    onPageChange: (n: number) => void;
    onLimitChange: (n: number) => void;
}

const IncidentsTable = ({
    incidents,
    isLoading,
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
            render: (row) => <h2 className="w-32 truncate font-semibold">{row.name}</h2>
        },
        {
            key: "location",
            header: "Location",
            render: (row) => (
                <div className="flex items-center gap-1 text-gray-900">
                    <MapPin className="h-4 w-4 shrink-0" />

                    <span className="line-clamp-2 truncate w-32">
                        {row.location}
                    </span>
                </div>
            ),
        },

        {
            key: "description",
            header: "Description",
            render: (row) => (
                <div className="max-w-xs line-clamp-2 text-sm font-medium text-gray-900 truncate">
                    {row.description}
                </div>
            ),
        },

        {
            key: "assignedGuard",
            header: "Reported By",
            render: (row) => (
                <div className="flex gap-2 items-center">
                    <UserAvatar
                        src=""
                        name={row.reporter?.name || "Unknown"}
                    />

                    <p className="text-sm font-semibold">
                        {row.reporter?.name || "Unknown"}
                    </p>
                </div>
            ),
        },

        {
            key: "dateTime",
            header: "Date/Time",
            render: (row) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {formatDate(row.createdAt)}
                    </div>

                    <div className="text-xs text-gray-500 mt-0.5">
                        {formatTime(row.createdAt)}
                    </div>
                </div>
            ),
        },

        {
            key: "actions",
            header: "Actions",
            align: "center",
            render: (row) => (
                <div className="flex justify-center items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <Link to={`/incidents/${row.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>

                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader />;

    return (
        <div className="bg-white rounded-xl space-y-2">
            <DataTable
                columns={columns}
                data={incidents}
                emptyText="No incidents available."
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

export default IncidentsTable;