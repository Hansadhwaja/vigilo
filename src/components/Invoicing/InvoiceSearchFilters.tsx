"use client";

import DataFilters from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const InvoiceSearchFilters = () => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search", "");
    const status = getParam("status", "");
    const month = getParam("month", "");

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
                <Button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            }
        />
    );
};

export default InvoiceSearchFilters;