import TimeSheetSearchFilters from "./TimeSheetSearchFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useGetAllTimeSheetsQuery } from "@/apis/schedulingAPI";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import TimeSheetTable from "./Table/TimeSheetTable";

const TimeSheetsTab = () => {
    const { getParam, setParam, setMultipleParams } = useQueryParams();

    const page = Number(getParam("page", "1"));
    const limit = Number(getParam("limit", "10"));
    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");
    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } = useGetAllGuardsQuery();

    const guards = guardsRes?.data ?? [];

    const { data, isLoading, isError, isFetching, error } = useGetAllTimeSheetsQuery({
        search: debouncedSearch,
        guardId,
        fromDate,
        toDate,
        page,
        limit
    });

    const timeSheets = data?.data ?? [];

    // Pagination
    const handlePageChange = (
        newPage: number
    ) => {
        setParam("page", String(newPage));
    };

    // Limit
    const handleLimitChange = (
        value: number
    ) => {
        setMultipleParams({
            limit: String(value),
            page: "1",
        });
    };

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
                page={data?.currentPage ?? 1}
                totalPages={Number(data?.totalPages) ?? 1}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoading || isFetching}
                isError={isError}
                error={error}
            />

        </div>
    );
};

export default TimeSheetsTab;