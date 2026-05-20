"use client";

import DataFilters from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Guard } from "@/apis/guardsApi";

interface GuardPaymentSearchFiltersProps {
    guards: Guard[];
    isGuardsLoading: boolean;
}

const GuardPaymentSearchFilters = ({
    guards,
}: GuardPaymentSearchFiltersProps) => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search", "");
    const guardId = getParam("guardId", "");
    const fromDate = getParam("fromDate", "");
    const toDate = getParam("toDate", "");

    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleGuardChange = (value: string) => {
        setMultipleParams({
            guardId: value,
            page: "1",
        });
    };

    const handleFromDateChange = (value: string) => {
        setMultipleParams({
            fromDate: value,
            page: "1",
        });
    };

    const handleToDateChange = (value: string) => {
        setMultipleParams({
            toDate: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            search: "",
            guardId: "",
            fromDate: "",
            toDate: "",
            page: "",
        });
    };

    const filters = [
        {
            key: "guardId",
            type: "select" as const,
            placeholder: "Select Guard",
            value: guardId,
            options: guards.map((g) => ({
                label: g.name,
                value: g.id,
            })),
            onChange: handleGuardChange,
            width: "w-[200px]",
        },
        {
            key: "fromDate",
            type: "date" as const,
            value: fromDate,
            onChange: handleFromDateChange,
        },
        {
            key: "toDate",
            type: "date" as const,
            value: toDate,
            onChange: handleToDateChange,
        },
    ];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search payments..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
        />
    );
};

export default GuardPaymentSearchFilters;