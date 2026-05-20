import { useMemo } from "react";

import { Filter, Search, X } from "lucide-react";

import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { useGetAllOrdersQuery } from "@/apis/ordersApi";

import Loader from "@/components/common/Loader";
import AlertListModal from "./Modal/AlertListModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import DataFilters, { FilterItem } from "../common/Filter/DataFilters";

const SchedulingSearchFilters = () => {
  const { getParam, setMultipleParams } = useQueryParams();

  const guardId = getParam("guardId");
  const search = getParam("search");
  const orderId = getParam("orderId");
  const role = getParam("role");

  const { data: guardsResponse, isLoading: isGuardsLoading } = useGetAllGuardsQuery();

  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetAllOrdersQuery();

  const guards = guardsResponse?.data ?? [];
  const orders = ordersResponse?.data ?? [];

  const roles = useMemo(
    () => [
      {
        label: "Static",
        value: "static",
      },
      {
        label: "Patrol",
        value: "patrol",
      },
    ],
    []
  );

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
      placeholder: "Select Site",
      value: orderId,
      width: "w-[220px]",
      onChange: handleOrderChange,
      options: orders.map((order) => ({
        label: order.locationAddress,
        value: order.id,
      })),
    },
    {
      key: "role",
      type: "select",
      placeholder: "Select Role",
      value: role,
      width: "w-[160px]",
      onChange: handleRoleChange,
      options: roles,
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