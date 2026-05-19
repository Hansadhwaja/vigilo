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

export interface DataTableProps<T extends RowWithId> {
    columns: Column<T>[];
    data: T[];
    emptyText?: string;
    footer?: ReactNode;
    rowClassName?: (row: T, index: number) => string;
}

export function DataTable<T extends RowWithId>({
    columns,
    data,
    emptyText = "No data found",
    footer,
    rowClassName,
}: DataTableProps<T>) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl",
                "border border-slate-200",
                "bg-white/90 backdrop-blur",
                "shadow-sm"
            )}
        >
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    {/* HEADER */}
                    <TableHeader className="bg-linear-to-r from-slate-50 via-white to-blue-50/40">
                        <TableRow className="border-slate-200 hover:bg-transparent">
                            {columns.map((col) => (
                                <TableHead
                                    key={String(col.key)}
                                    className={cn(
                                        "h-14 whitespace-nowrap px-5",
                                        "text-xs font-bold uppercase tracking-[0.18em]",
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
                                        "border-slate-100 transition-colors",
                                        "hover:bg-slate-50/70",
                                        rowClassName?.(row, index)
                                    )}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            className={cn(
                                                "px-5 py-4 align-middle",
                                                "text-sm text-slate-700",
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
                                                    ? String(row[col.key as keyof T])
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
                                    className="h-40 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div
                                            className="
                                                flex h-12 w-12 items-center justify-center
                                                rounded-full bg-slate-100
                                            "
                                        >
                                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-500">
                                            {emptyText}
                                        </p>
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
    );
}