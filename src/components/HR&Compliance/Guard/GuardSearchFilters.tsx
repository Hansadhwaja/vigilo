import DataFilters from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const GuardSearchFilters = () => {

    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const search = getParam("search", "");

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
            searchPlaceholder="Search guards..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={[]}
        />
    );
};

export default GuardSearchFilters;