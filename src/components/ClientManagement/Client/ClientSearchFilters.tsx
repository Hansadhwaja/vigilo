import DataFilters from "@/components/common/Filter/DataFilters";

import { useQueryParams } from "@/lib/hooks/useQueryParams";

const ClientSearchFilters = () => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search");

    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            search: "",
            page: "",
        });
    };

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search clients..."
            onSearchChange={handleSearch}
            onClear={clearParams}
        />
    );
};

export default ClientSearchFilters;