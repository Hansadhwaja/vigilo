"use client";

import DataFilters from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const ComplianceSearchFilters = () => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search", "");
    const status = getParam("status", "");

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

    const clearParams = () => {
        setMultipleParams({
            search: "",
            status: "",
            page: "",
        });
    };

    const filters = [
        {
            key: "status",
            type: "select" as const,
            placeholder: "Status",
            value: status,
            options: [
                { label: "All Status", value: "all" },
                { label: "Completed", value: "completed" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Pending", value: "pending" },
                { label: "Overdue", value: "overdue" },
            ],
            onChange: handleStatusChange,
            width: "w-[180px]",
        },
    ];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search compliance..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
        />
    );
};

export default ComplianceSearchFilters;