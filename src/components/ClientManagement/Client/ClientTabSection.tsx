import ClientSearchFilters from './ClientSearchFilters'
import ClientTable from './Table/ClientTable'
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { useGetAllClientsQuery } from '@/apis/ordersApi';

const ClientTabSection = () => {
  const {
    getParam,
    setParam,
    setMultipleParams,
  } = useQueryParams();

  const page = Number(getParam("page", "1"));
  const limit = Number(getParam("limit", "10"));
  const search = getParam("search");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, isFetching, error } = useGetAllClientsQuery({
    search: debouncedSearch,
    page,
    limit,
  });

  const {
    data: clients = [],
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
    <div className="space-y-4">
      <ClientSearchFilters />
      <ClientTable
        clients={clients}
        page={pagination?.page ?? 1}
        totalPages={Number(pagination?.totalPages) ?? 1}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading || isFetching}
        isError={isError}
        error={error}
      />
    </div>
  )
}

export default ClientTabSection