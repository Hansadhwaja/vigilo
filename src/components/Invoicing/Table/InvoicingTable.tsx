"use client";

import {
    Column,
    DataTable,
    RowWithId,
} from "@/components/common/Table/DataTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Download,
    FileText,
    User,
    Calendar,
    DollarSign,
} from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceType } from "@/types";

import { useGenerateInvoicePDFMutation } from "@/apis/invoiceApis";
import { useState } from "react";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

interface InvoicingTableProps {
    invoices: InvoiceType[];
}

const InvoicingTable = ({ invoices }: InvoicingTableProps) => {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [generateInvoicePDF] = useGenerateInvoicePDFMutation();

    const handleDownload = async (id: string) => {
        setLoadingId(id);
        try {
            const res = await generateInvoicePDF(id).unwrap();
            window.open(res?.data?.invoiceUrl, "_blank");
            toast.success("Invoice downloaded");
        } catch {
            toast.error("Failed to generate invoice");
        } finally {
            setLoadingId(null);
        }
    };

    const columns: Column<InvoiceType & RowWithId>[] = [
        {
            key: "invoiceNumber",
            header: "Invoice",

            render: (row) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <p className="font-semibold text-slate-800">
                            {row.invoiceNumber}
                        </p>
                    </div>

                    <p className="text-sm text-slate-400 font-mono">
                        #{row.id.slice(0, 8)}
                    </p>
                </div>
            ),
        },

        {
            key: "clientName",
            header: "Client",

            render: (row) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-sky-500" />
                    <p className="font-medium text-slate-700">
                        {row.clientName}
                    </p>
                </div>
            ),
        },

        {
            key: "services",
            header: "Services",

            render: (row) => {
                const s = row.services;
                if (!s) return "-";

                const parts = [];
                if (s.orders > 0) parts.push(`${s.orders} Orders`);
                if (s.custom > 0) parts.push(`${s.custom} Custom`);
                if (s.alarms > 0) parts.push(`${s.alarms} Alarms`);

                return (
                    <p className="text-sm text-slate-600">
                        {parts.length ? parts.join(", ") : "-"}
                    </p>
                );
            },
        },

        {
            key: "billingPeriod",
            header: "Period",
        },

        {
            key: "amount",
            header: "Amount",

            render: (row) => (
                <div className="flex items-center gap-2 font-semibold text-green-500">
                    {formatCurrency(row.amount)}
                </div>
            ),
        },

        {
            key: "status",
            header: "Status",

            render: (row) => (
                <Badge
                    className={`capitalize rounded-full px-3 py-1 text-sm font-semibold
                        ${row.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : row.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                : "bg-slate-100 text-slate-700 border"
                        }
                    `}
                >
                    {row.status}
                </Badge>
            ),
        },

        {
            key: "dueDate",
            header: "Due Date",

            render: (row) => (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {formatDate(row.dueDate)}
                </div>
            ),
        },

        {
            key: "actions",
            header: "Actions",
            align: "center",

            render: (row) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDownload(row.id)}
                    disabled={loadingId === row.id}
                >
                    {loadingId === row.id ? (
                        <Loader />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    PDF
                </Button>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={invoices}
            emptyText="No invoices found"
        />
    );
};

export default InvoicingTable;