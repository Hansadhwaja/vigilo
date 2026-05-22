import { useGetAllOrdersQuery } from "@/apis/ordersApi";

import OrderSearchFilters from "./OrderSearchFilters";
import OrderTable from "./Table/OrderTable";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";
import OrderStats from "./OrderStats";

const OrderTabSection = () => {
    const {
        getParam,
        setParam,
        setMultipleParams,
    } = useQueryParams();

    const page = Number(getParam("page", "1"));
    const limit = Number(getParam("limit", "10"));
    const search = getParam("search");
    const status = getParam("status", "all");
    const serviceType = getParam("serviceType", "all");
    const debouncedSearch = useDebounce(search, 500);

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useGetAllOrdersQuery({
        page,
        limit,
        status,
        serviceType: serviceType !== "all" ? serviceType : undefined,
        search: debouncedSearch.trim() || undefined,
    });

    const {
        data: orders = [],
        pagination,
        summary
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
            <OrderStats
                totalOrders={summary?.total ?? 0}
                activeOrders={summary?.active ?? 0}
                totalRevenue={summary?.totalRevenue ?? 0}
                avgOrderValue={summary?.avgvalue ?? 0}
            />
            <OrderSearchFilters />

            <OrderTable
                orders={orders}
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
    );
};

export default OrderTabSection;