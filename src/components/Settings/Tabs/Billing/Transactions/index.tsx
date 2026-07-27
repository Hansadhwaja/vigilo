import TransactionsTable from "./Table/TransactionsTable";
import { useGetAllTransactionsQuery } from "@/store/apis/transactionApis";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const TransactionSection = () => {
  const { getParam, setParam, setMultipleParams } = useQueryParams();
  const page = Number(getParam("page", "1"));
  const limit = Number(getParam("limit", "6"));
  const { data, isLoading, isError, error, isFetching } =
    useGetAllTransactionsQuery({
      page,
      limit,
    });

  const transactions = data?.data ?? [];

  const { data: orders = [], pagination, summary } = data ?? {};

  // Pagination
  const handlePageChange = (newPage: number) => {
    setParam("page", String(newPage));
  };

  // Limit
  const handleLimitChange = (value: number) => {
    setMultipleParams({
      limit: String(value),
      page: "1",
    });
  };

  return (
    <TransactionsTable
      transactions={transactions}
      page={pagination?.page ?? 1}
      totalPages={Number(pagination?.totalPages ?? 1)}
      limit={limit}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      isLoading={isLoading || isFetching}
      isError={isError}
      error={error}
    />
  );
};

export default TransactionSection;
