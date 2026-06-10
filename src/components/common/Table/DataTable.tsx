import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { ReactNode } from "react";

import TablePagination from "./TablePagination";

export interface RowWithId {
    id: string;
}

export type Column<T extends RowWithId> = {
    key: keyof T | string;
    header: string;
    align?: "left" | "right" | "center";
    render?: (row: T, index: number) => ReactNode;
    className?: string;
    headerClassName?: string;
};

interface DataTableProps<T extends RowWithId> {
    columns: Column<T>[];
    data: T[];

    footer?: ReactNode;

    rowClassName?: (row: T, index: number) => string;

    emptyText?: string;
    emptyIcon?: ReactNode;

    isLoading?: boolean;
    loadingText?: string;

    isError?: boolean;
    error?: any;

    page?: number;
    totalPages?: number;
    limit?: number;

    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

export function DataTable<T extends RowWithId>({
    columns,
    data,

    footer,
    rowClassName,

    emptyText = "No data found",
    emptyIcon,

    isLoading,
    loadingText = "Loading data...",

    isError,
    error,

    page = 1,
    totalPages = 1,
    limit = 10,

    onPageChange,
    onLimitChange,
}: DataTableProps<T>) {
    /* ---------------- LOADING ---------------- */

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 shadow-sm">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange-500 border-r-transparent" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                    {loadingText}
                </p>
            </div>
        );
    }

    /* ---------------- ERROR ---------------- */

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/40 py-16 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                </div>

                <p className="mt-4 font-semibold text-red-600">
                    Failed to load data
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {error && "data" in error
                        ? JSON.stringify(error.data)
                        : "Something went wrong"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* TABLE WRAPPER */}
            <div
                className={cn(
                    "overflow-hidden rounded-3xl",
                    "border border-slate-200/80",
                    "bg-white shadow-sm"
                )}
            >
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        {/* HEADER */}
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="border-slate-200 hover:bg-transparent">
                                {columns.map((col) => (
                                    <TableHead
                                        key={String(col.key)}
                                        className={cn(
                                            "h-14 whitespace-nowrap px-6",
                                            "font-bold uppercase tracking-[0.12em]",
                                            "text-slate-500",
                                            col.align === "right" && "text-right",
                                            col.align === "center" && "text-center",
                                            col.headerClassName
                                        )}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        {/* BODY */}
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <TableRow
                                        key={row.id ?? index}
                                        className={cn(
                                            "group border-slate-100 transition-all duration-200",
                                            "hover:bg-orange-50/30",
                                            rowClassName?.(row, index)
                                        )}
                                    >
                                        {columns.map((col) => (
                                            <TableCell
                                                key={String(col.key)}
                                                className={cn(
                                                    "border-b border-slate-100/80 px-6 py-5 align-middle",
                                                    "text-slate-700",
                                                    col.align === "right" && "text-right",
                                                    col.align === "center" && "text-center",
                                                    col.className
                                                )}
                                            >
                                                {col.render
                                                    ? col.render(row, index)
                                                    : (
                                                        col.key in row &&
                                                        String(row[col.key as keyof T]) !== ""
                                                    )
                                                        ? (
                                                            <span className="font-medium text-slate-700">
                                                                {String(
                                                                    row[col.key as keyof T]
                                                                )}
                                                            </span>
                                                        )
                                                        : (
                                                            <span className="text-slate-400">
                                                                —
                                                            </span>
                                                        )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-56 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            {emptyIcon || (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                                    <div className="h-3 w-3 rounded-full bg-slate-400" />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {emptyText}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    Try adjusting your filters or
                                                    search query
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        {/* FOOTER */}
                        {footer && (
                            <TableFooter className="border-t border-slate-200 bg-slate-50/60">
                                {footer}
                            </TableFooter>
                        )}
                    </Table>
                </div>
            </div>

            {/* PAGINATION */}
            {onPageChange && onLimitChange && (
                <TablePagination
                    currentPage={page}
                    totalPages={totalPages}
                    limit={limit}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            )}
        </div>
    );
}