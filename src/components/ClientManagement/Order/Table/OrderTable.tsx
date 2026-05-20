import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import { Badge } from "@/components/ui/badge";

import {
    Building,
    Calendar,
    EllipsisVertical,
    Eye,
    MapPin,
    User,
} from "lucide-react";

import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

import { Order } from "@/apis/ordersApi";

import { Link } from "react-router-dom";

import EditOrderModal from "../Modal/EditOrderModal";
import AcceptOrderModal from "../Modal/AcceptOrderModal";
import RejectOrderModal from "../Modal/RejectOrderModal";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDate } from "@/lib/utils";

interface OrderTableProps {
    page: number;
    onPageChange: (n: number) => void;
    limit: number;
    onLimitChange: (n: number) => void;
    orders: Order[];
    isLoading: boolean;
    isError: boolean;
    error: any;
    totalPages: number;
}

const OrderTable = ({
    orders,
    isError,
    error,
    page = 1,
    totalPages = 1,
    onPageChange,
    isLoading,
    limit,
    onLimitChange,
}: OrderTableProps) => {
    const getOrderUrgency = (order: any) => {
        if (order.status !== "pending") return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(order.startDate);
        startDate.setHours(0, 0, 0, 0);

        const daysUntilStart = Math.floor(
            (startDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (daysUntilStart < 0) {
            return {
                type: "expired",
                days: Math.abs(daysUntilStart),
            };
        } else if (daysUntilStart <= 2) {
            return {
                type: "urgent",
                days: daysUntilStart,
            };
        }

        return null;
    };

    const columns: Column<Order & RowWithId>[] = [
        {
            key: "serviceType",
            header: "Service",

            render: (row) => {
                const urgency = getOrderUrgency(row);

                return (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold capitalize text-slate-800">
                                {row.serviceType}
                            </p>

                            {urgency?.type === "expired" && (
                                <Badge className="rounded-full border-0 bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold text-red-600">
                                    Expired · {urgency.days}d
                                </Badge>
                            )}

                            {urgency?.type === "urgent" && (
                                <Badge className="rounded-full border-0 bg-orange-100 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600">
                                    {urgency.days}d left
                                </Badge>
                            )}
                        </div>

                        <p className="font-mono text-xs text-slate-400">
                            #{row.id.slice(0, 8)}
                        </p>
                    </div>
                );
            },
        },

        {
            key: "locationAddress",
            header: "Location",

            render: (row) => (
                <div className="flex max-w-60 items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-sky-100 p-1.5">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" />
                    </div>

                    <div className="space-y-1">
                        <p className="line-clamp-2 font-medium leading-5 text-slate-700">
                            {row.locationAddress}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "schedule",
            header: "Schedule",

            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-violet-100 p-1.5">
                        <Calendar className="h-3.5 w-3.5 text-violet-600" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                            {formatDate(row.startDate)}
                        </p>

                        <p className="text-xs text-slate-500">
                            to {formatDate(row.endDate)}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "guardsRequired",
            header: "Guards",
            align: "center",

            render: (row) => (
                <div className="flex items-center justify-center gap-3">
                    <div className="rounded-full bg-orange-100 p-1.5">
                        <User className="h-3.5 w-3.5 text-orange-600" />
                    </div>

                    <div className="space-y-0.5 text-left">
                        <p className="font-semibold text-slate-800">
                            {row.guardsRequired}
                        </p>

                        <p className="text-xs text-slate-500">
                            Guards
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "status",
            header: "Status",
            align: "center",

            render: (row) => (
                <Badge
                    className="rounded-full border px-3 py-1 text-xs font-semibold shadow-sm"
                    style={getStatusStyle(row.status)}
                >
                    {getStatusColor(row.status).label}
                </Badge>
            ),
        },

        {
            key: "createdAt",
            header: "Created",

            render: (row) => (
                <div className="space-y-1">
                    <p className="font-medium text-slate-700">
                        {formatDate(row.createdAt)}
                    </p>

                    <p className="text-xs text-slate-400">
                        Created
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
                        to={`/clients/${row.id}`}
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
                            className="w-48 rounded-2xl"
                        >
                            {row.status !== "completed" &&
                                row.status !== "cancelled" && (
                                    <>
                                        <DropdownMenuItem>
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <EditOrderModal
                                                    order={row}
                                                />
                                            </div>
                                        </DropdownMenuItem>

                                        {row.status === "pending" && (
                                            <DropdownMenuSeparator />
                                        )}
                                    </>
                                )}

                            {row.status === "pending" && (
                                <>
                                    <DropdownMenuItem>
                                        <div
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <AcceptOrderModal
                                                id={row.id}
                                            />
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem>
                                        <div
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <RejectOrderModal
                                                id={row.id}
                                            />
                                        </div>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            isError={isError}
            error={error}
            loadingText="Loading orders..."
            emptyText="No orders found"
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

export default OrderTable;