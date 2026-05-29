"use client";

import DataFilters from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../common/Loader";
import { toast } from "sonner";
import { useExportInvoicesMutation } from "@/apis/invoiceApis";

const InvoiceSearchFilters = () => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search", "");
    const status = getParam("status", "");
    const month = getParam("month", "");


    const [exportInvoices, { isLoading: isExporting }] = useExportInvoicesMutation();

    const handleExport = async () => {
        try {
            const blob = await exportInvoices(undefined).unwrap();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `invoices-report-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Invoices Exported Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while exporting Invoices")
        }
    }


    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleStatusChange = (value: string) => {
        setMultipleParams({
            status: value,
            page: "1",
        });
    };

    const handleMonthChange = (value: string) => {
        setMultipleParams({
            month: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            search: "",
            status: "",
            month: "",
            page: "",
        });
    };

    const invoiceStatus = [
        { label: "All", value: "all" },
        { label: "Paid", value: "paid" },
        { label: "Pending", value: "pending" },
        { label: "Outstanding", value: "outstanding" },
        { label: "Overdue", value: "overdue" },
    ];

    const months = [
        { label: "Jan 2026", value: "01-26" },
        { label: "Feb 2026", value: "02-26" },
        { label: "Mar 2026", value: "03-26" },
        { label: "Apr 2026", value: "04-26" },
        { label: "May 2026", value: "05-26" },
    ];

    const filters = [
        {
            key: "status",
            type: "select" as const,
            placeholder: "Status",
            value: status,
            options: invoiceStatus,
            onChange: handleStatusChange,
            width: "w-[160px]",
        },
        {
            key: "month",
            type: "select" as const,
            placeholder: "Month",
            value: month,
            options: months,
            onChange: handleMonthChange,
            width: "w-[160px]",
        },
    ];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search invoices, clients, or IDs..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
            others={
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleExport}
                    disabled={isExporting}
                >

                    {isExporting ? <Loader /> : (
                        <>
                            <Download className="h-4 w-4" />
                            Export
                        </>


                    )}
                </Button>
            }
        />
    );
};

export default InvoiceSearchFilters;