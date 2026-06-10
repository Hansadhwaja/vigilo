import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import {
    Building,
    EllipsisVertical,
    Mail,
    Phone,
    User,
} from "lucide-react";

import { Client } from "@/apis/usersApi";

import EditClientModal from "../Modal/EditClientModal";
import ViewClientModal from "../Modal/ViewClientModal";
import DeleteClientModal from "../Modal/DeleteClientModal";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    const columns: Column<Client & RowWithId>[] = [
        {
            key: "name",
            header: "Client",

            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                        <User className="h-4 w-4 text-orange-600" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold text-slate-800">
                            {row.name}
                        </p>

                        <p className="font-mono text-sm text-slate-400">
                            #{row.id.slice(0, 8)}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "email",
            header: "Email",

            render: (row) => (
                <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-full bg-sky-100 p-2">
                        <Mail className="h-4 w-4 text-sky-600" />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <p
                            className="truncate font-medium text-slate-700"
                            title={row.email}
                        >
                            {row.email}
                        </p>

                        <p className="text-sm text-slate-400">
                            Email Address
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "mobile",
            header: "Phone",

            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                        <Phone className="h-4 w-4 text-emerald-600" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-medium text-slate-700">
                            {row.mobile}
                        </p>

                        <p className="text-sm text-slate-400">
                            Mobile Number
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "address",
            header: "Address",

            render: (row) => (
                <div className="max-w-[260px] space-y-1">
                    <p
                        className="line-clamp-2 leading-5 text-slate-700"
                        title={row.address || "No address"}
                    >
                        {row.address || "—"}
                    </p>

                    <p className="text-sm text-slate-400">
                        Client Address
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
                    <ViewClientModal client={row} />

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="
                                rounded-xl border border-slate-200
                                p-2 text-slate-500 transition-all
                                hover:border-slate-300
                                hover:bg-slate-50
                                hover:text-slate-700
                            "
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44 rounded-2xl"
                        >
                            <DropdownMenuItem>
                                <div
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >
                                    <EditClientModal client={row} />
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <div
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >
                                    <DeleteClientModal client={row} />
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={clients}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading clients..."
            emptyText="No clients found"
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

export default ClientTable;