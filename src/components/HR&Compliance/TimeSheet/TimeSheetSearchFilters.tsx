"use client";

import DataFilters, { FilterItem } from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Guard } from "@/apis/guardsApi";

interface TimeSheetSearchFiltersProps {
    guards: Guard[];
    isGuardsLoading: boolean;
}

const TimeSheetSearchFilters = ({
    guards,
}: TimeSheetSearchFiltersProps) => {
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
            type: "select",
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
            type: "date",
            value: fromDate,
            onChange: handleFromDateChange,
        },
        {
            key: "toDate",
            type: "date",
            value: toDate,
            onChange: handleToDateChange,
        },
    ] satisfies FilterItem[];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search timesheets..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
        />
    );
};

export default TimeSheetSearchFilters;