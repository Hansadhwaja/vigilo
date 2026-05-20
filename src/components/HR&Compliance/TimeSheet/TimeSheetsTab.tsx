import TimeSheetSearchFilters from "./TimeSheetSearchFilters";

import {
    useQueryParams
} from "@/lib/hooks/useQueryParams";

import {
    useDebounce
} from "@/lib/hooks/useDebounce";

import {
    useGetAllTimeSheetsQuery
} from "@/apis/schedulingAPI";

import {
    useGetAllGuardsQuery
} from "@/apis/guardsApi";

import SectionCard from "@/components/common/Card/SectionCard";

import {
    Clock
} from "lucide-react";

import TimeSheetTable from "./Table/TimeSheetTable";

const TimeSheetsTab = () => {
    const { getParam } = useQueryParams();

    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");

    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } =
        useGetAllGuardsQuery();

    const guards = guardsRes?.data ?? [];

    const { data, isLoading, isError, isFetching, error } =
        useGetAllTimeSheetsQuery({
            search: debouncedSearch,
            guardId,
            fromDate,
            toDate,
        });

    const timeSheets = data?.data ?? [];

    return (
        <div className="space-y-6">
            {/* FILTERS */}
            <TimeSheetSearchFilters
                guards={guards}
                isGuardsLoading={isGuardsLoading}
            />

            {/* TABLE */}
            <TimeSheetTable
                timeSheets={timeSheets}
                isLoading={isLoading || isFetching}
                isError={isError}
                error={error}
            />

        </div>
    );
};

export default TimeSheetsTab;