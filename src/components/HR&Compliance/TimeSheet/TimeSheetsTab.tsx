import TimeSheetSearchFilters from './TimeSheetSearchFilters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useGetAllTimeSheetsQuery } from '@/apis/schedulingAPI';
import TimeSheetTable from './Table/TimeSheetTable';
import { useGetAllGuardsQuery } from '@/apis/guardsApi';

const TimeSheetsTab = () => {
    const {
        getParam,
    } = useQueryParams();

    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");
    const guardId = getParam("guardId");
    const search = getParam("search");
    const page = getParam("page");
    const limit = getParam("limit");
    const debouncedSearch = useDebounce(search, 500);

    const { data: guardsRes, isLoading: isGuardsLoading } = useGetAllGuardsQuery();
    const guards = guardsRes?.data ?? [];

    const { data, isLoading, isError, isFetching, error } = useGetAllTimeSheetsQuery({
        search: debouncedSearch,
        guardId,
        fromDate,
        toDate
    });

    const timeSheets = data?.data ?? [];

    console.log(timeSheets);


    return (
        <Card className='p-0'>
            <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold">Time Sheets</CardTitle>
                <CardDescription>Review and approve guard time sheets</CardDescription>
                <TimeSheetSearchFilters
                    guards={guards}
                    isGuardsLoading={isGuardsLoading}
                />
            </CardHeader>
            <CardContent className="p-2">
                <TimeSheetTable
                    timeSheets={timeSheets}
                    isLoading={isLoading || isFetching}
                    isError={isError}
                    error={error}
                />
            </CardContent>
        </Card>
    )
}

export default TimeSheetsTab