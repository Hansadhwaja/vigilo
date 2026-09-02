import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllGuardsQuery } from "@/store/apis/guardsApi";
import { useGetAllOrdersQuery } from "@/store/apis/ordersApi";

import AlertListModal from "./Modal/AlertListModal";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import DataFilters, { FilterItem } from "../common/Filter/DataFilters";
import { services } from "@/constants";

const SchedulingSearchFilters = () => {
  const { getParam, setMultipleParams } = useQueryParams();

  const guardId = getParam("guardId");
  const search = getParam("search");
  const orderId = getParam("orderId");
  const role = getParam("role");

  const { data: guardsResponse, isLoading: isGuardsLoading } =
    useGetAllGuardsQuery();

  const { data: ordersResponse, isLoading: isOrdersLoading } =
    useGetAllOrdersQuery({
      status: "active",
    });

  const guards = guardsResponse?.data ?? [];
  const orders = ordersResponse?.data ?? [];

  const handleSearch = (value: string) => {
    setMultipleParams({
      search: value,
      page: "1",
    });
  };

  const handleGuardChange = (value: string) => {
    setMultipleParams({
      guardId: value,
      page: "1",
    });
  };

  const handleOrderChange = (value: string) => {
    setMultipleParams({
      orderId: value,
      page: "1",
    });
  };

  const handleRoleChange = (value: string) => {
    setMultipleParams({
      role: value,
      page: "1",
    });
  };

  const clearParams = () => {
    setMultipleParams({
      guardId: "",
      orderId: "",
      role: "",
      search: "",
      page: "",
    });
  };

  const filters = [
    {
      key: "guard",
      type: "select",
      placeholder: "Select Guard",
      value: guardId,
      width: "w-[180px]",
      onChange: handleGuardChange,
      options: guards.map((guard) => ({
        label: guard.name,
        value: guard.id,
      })),
    },
    {
      key: "order",
      type: "select",
      placeholder: "Select Location Name",
      value: orderId,
      width: "w-[220px]",
      onChange: handleOrderChange,
      options: orders.map((order) => ({
        label: (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="truncate max-w-40 cursor-default">
                {order.locationName}
              </p>
            </TooltipTrigger>

            <TooltipContent>{order.locationName}</TooltipContent>
          </Tooltip>
        ),
        value: order.id,
      })),
    },
    {
      key: "role",
      type: "select",
      placeholder: "Select Service Type",
      value: role,
      width: "w-[160px]",
      onChange: handleRoleChange,
      options: services,
    },
  ] satisfies FilterItem[];

  return (
    <DataFilters
      searchValue={search}
      searchPlaceholder="Search schedules..."
      onSearchChange={handleSearch}
      onClear={clearParams}
      filters={filters}
      others={<AlertListModal />}
    />
  );
};

export default SchedulingSearchFilters;
