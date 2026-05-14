import GuardSearchFilters from './GuardSearchFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GuardTable from './Table/GuardTable'
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useGetAllGuardsQuery } from '@/apis/guardsApi';

const GuardsTab = () => {
    const {
        getParam,
        setParam,
        setMultipleParams,
    } = useQueryParams();

    const page = Number(getParam("page", "1"));
    const limit = Number(getParam("limit", "10"));
    const search = getParam("search");
    const debouncedSearch = useDebounce(search, 500);


    const { data, isLoading, isError, isFetching, error } = useGetAllGuardsQuery({
        search: debouncedSearch,
        page,
        limit,
    });

    const {
        data: guards = [],
        pagination,
    } = data ?? {};

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
        <Card className='p-0'>
            <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold">Guard Directory</CardTitle>
                <GuardSearchFilters />
            </CardHeader>
            <CardContent className="p-2">
                <GuardTable
                    guards={guards}
                    page={pagination?.page ?? 1}
                    totalPages={Number(pagination?.totalPages) ?? 1}
                    limit={limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={isLoading || isFetching}
                    isError={isError}
                    error={error}
                />
            </CardContent>
        </Card>
    )
}

export default GuardsTab