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
};

export interface DataTableProps<T extends RowWithId> {
    columns: Column<T>[];
    data: T[];
    emptyText?: string;
    footer?: ReactNode;
}

export function DataTable<T extends RowWithId>({
    columns,
    data,
    emptyText = "No data found",
    footer,
}: DataTableProps<T>) {
    return (
        <div className="border rounded-md">
            <div className="overflow-x-auto w-full">
                <Table className="min-w-200">
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead
                                    key={String(col.key)}
                                    className={cn("text-xs md:text-sm font-semibold",
                                        col.align === "right" && "text-right",
                                        col.align === "center" && "text-center"
                                    )}
                                >
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow key={row.id ?? index}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            className={cn("text-xs md:text-sm",
                                                col.align === "right" && "text-right",
                                                col.align === "center" && "text-center"
                                            )}
                                        >
                                            {col.render
                                                ? col.render(row, index)
                                                : ((col.key in row && String(row[col.key as keyof T]) !== "") ? String(row[col.key as keyof T]) : "-")}

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-muted-foreground py-4"
                                >
                                    {emptyText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {footer && <TableFooter>{footer}</TableFooter>}
                </Table>
            </div>
        </div>
    );
}
