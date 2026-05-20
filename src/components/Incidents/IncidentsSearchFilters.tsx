import { useMemo } from "react";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import DataFilters, { FilterItem } from "@/components/common/Filter/DataFilters";

const IncidentsSearchFilters = () => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const status = getParam(
        "status"
    );

    const search = getParam(
        "search"
    );

    const statuses = useMemo(
        () => [
            {
                label: "Pending",
                value: "pending",
            },
            {
                label: "Resolved",
                value: "resolved",
            },
            {
                label: "In Progress",
                value: "progress",
            },
        ],
        []
    );

    // SEARCH
    const handleSearch = (
        value: string
    ) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    // STATUS
    const handleStatusChange = (
        value: string
    ) => {
        setMultipleParams({
            status: value,
            page: "1",
        });
    };

    // CLEAR
    const clearParams = () => {
        setMultipleParams({
            status: "",
            search: "",
            page: "1",
        });
    };

    const filters = [
        {
            key: "status",
            type: "select",
            placeholder: "Select Status",
            value: status,
            width: "w-[180px]",
            onChange: handleStatusChange,
            options: statuses,
        },
    ] satisfies FilterItem[];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search incidents..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
        />
    );
};

export default IncidentsSearchFilters;