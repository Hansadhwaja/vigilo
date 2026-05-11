import React from "react";
import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    AlertCircle,
    Building,
    Calendar,
    Edit,
    EllipsisVertical,
    Eye,
    MapPin,
    User,
} from "lucide-react";
import TablePagination from "@/components/common/Table/TablePagination";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { Order } from "@/apis/ordersApi";
import { Link } from "react-router-dom";
import EditOrderModal from "../Modal/EditOrderModal";
import AcceptOrderModal from "../Modal/AcceptOrderModal";
import RejectOrderModal from "../Modal/RejectOrderModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

        const daysUntilStart = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilStart < 0) {
            return { type: "expired", days: Math.abs(daysUntilStart), color: "bg-red-50" };
        } else if (daysUntilStart <= 2) {
            return { type: "urgent", days: daysUntilStart, color: "bg-red-50" };
        }

        return null;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const columns: Column<Order & RowWithId>[] = [
        {
            key: "serviceType",
            header: "Service",
            render: (row) => {
                const urgency = getOrderUrgency(row);

                return (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">
                                {row.serviceType}
                            </span>

                            {urgency?.type === "expired" && (
                                <Badge className="bg-red-500 text-white text-xs">
                                    EXPIRED · {urgency.days}d
                                </Badge>
                            )}

                            {urgency?.type === "urgent" && (
                                <Badge className="bg-orange-500 text-white text-xs">
                                    {urgency.days}d left
                                </Badge>
                            )}

                            {urgency?.type === "warning" && (
                                <Badge className="bg-amber-500 text-white text-xs">
                                    {urgency.days}d
                                </Badge>
                            )}
                        </div>

                        <span className="text-sm text-gray-500 font-mono">
                            #{row.id.slice(0, 8)}
                        </span>
                    </div>
                );
            },
        },

        {
            key: "locationAddress",
            header: "Location",
            render: (row) => (
                <div className="flex items-start gap-2 max-w-52">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />

                    <span className="line-clamp-2 text-sm text-gray-700">
                        {row.locationAddress}
                    </span>
                </div>
            ),
        },

        {
            key: "schedule",
            header: "Schedule",
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Calendar className="h-4 w-4 text-gray-400" />

                    <span className="text-sm text-gray-700">
                        {formatDate(row.startDate)} →{" "}
                        {formatDate(row.endDate)}
                    </span>
                </div>
            ),
        },

        {
            key: "guardsRequired",
            header: "Guards",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />

                    <span className="font-medium">
                        {row.guardsRequired}
                    </span>
                </div>
            ),
        },

        {
            key: "status",
            header: "Status",
            render: (row) => (
                <Badge
                    className="font-medium border-2"
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
                <span className="text-sm text-gray-600">
                    {formatDate(row.createdAt)}
                </span>
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
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <EllipsisVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {row.status !== "completed" && row.status !== "cancelled" && (<>
                                <DropdownMenuItem>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <EditOrderModal order={row} />
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
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <AcceptOrderModal id={row.id} />
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <RejectOrderModal id={row.id} />
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />

                <p className="mt-3 text-gray-600">
                    Loading orders...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-3" />

                <p className="text-red-600 font-medium">
                    Failed to load orders
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    {error && "data" in error
                        ? JSON.stringify(error.data)
                        : "An error occurred"}
                </p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Building className="h-10 w-10 text-gray-400 mb-3" />

                <p className="text-gray-700 font-medium">
                    No orders found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl space-y-2">
            <DataTable
                columns={columns}
                data={orders}
                emptyText="No orders available."
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

export default OrderTable;