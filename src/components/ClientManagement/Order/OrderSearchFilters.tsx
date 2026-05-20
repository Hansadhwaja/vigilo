import { orderStatus, services } from '@/constants';
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import DataFilters from '@/components/common/Filter/DataFilters';

const OrderSearchFilters = () => {

    const { getParam, setMultipleParams } = useQueryParams();

    const status = getParam("status");
    const search = getParam("search");
    const serviceType = getParam("serviceType");

    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleStatusChange = (value: string) => {
        setMultipleParams({
            status: value,
            page: "1",
        });
    };

    const handleServiceChange = (value: string) => {
        setMultipleParams({
            serviceType: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            status: "",
            serviceType: "",
            search: "",
            page: "",
        });
    };

    const filters = [
        {
            key: "status",
            placeholder: "Select Status",
            value: status,
            options: orderStatus,
            onChange: handleStatusChange,
            width: "w-[180px]",
        },
        {
            key: "serviceType",
            placeholder: "Select Service",
            value: serviceType,
            options: services,
            onChange: handleServiceChange,
            width: "w-[180px]",
        },
    ];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search orders..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
        />
    )
}

export default OrderSearchFilters