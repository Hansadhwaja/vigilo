import { useMemo } from "react";
import DataFilters, { FilterItem } from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const AlarmSearchFilters = () => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const status =
        getParam("status");

    const search =
        getParam("search");

    const priority =
        getParam("priority");

    const statuses = useMemo(
        () => [
            {
                label: "Pending",
                value: "pending",
            },
            {
                label: "Ongoing",
                value: "ongoing",
            },
            {
                label: "Completed",
                value: "completed",
            },
            {
                label: "Cancelled",
                value: "cancelled",
            },
            {
                label: "Delayed",
                value: "delayed",
            },
        ],
        []
    );

    const priorities = useMemo(
        () => [
            {
                label: "Critical",
                value: "critical",
            },
            {
                label: "High",
                value: "high",
            },
            {
                label: "Medium",
                value: "medium",
            },
            {
                label: "Low",
                value: "low",
            },
        ],
        []
    );

    const handleSearch = (
        value: string
    ) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleStatusChange = (
        value: string
    ) => {
        setMultipleParams({
            status: value,
            page: "1",
        });
    };

    const handlePriorityChange = (
        value: string
    ) => {
        setMultipleParams({
            priority: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            status: "",
            priority: "",
            search: "",
            page: "1",
        });
    };

    const filters = [
        {
            key: "status",
            type: "select",
            placeholder:
                "Select Status",
            value: status,
            width: "w-[180px]",
            onChange:
                handleStatusChange,
            options: statuses,
        },

        {
            key: "priority",
            type: "select",
            placeholder:
                "Select Priority",
            value: priority,
            width: "w-[180px]",
            onChange:
                handlePriorityChange,
            options: priorities,
        },
    ] satisfies FilterItem[];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search alarms..."
            onSearchChange={
                handleSearch
            }
            onClear={clearParams}
            filters={filters}
        />
    );
};

export default AlarmSearchFilters;