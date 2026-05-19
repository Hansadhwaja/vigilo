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

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        {/* Left */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Filter Badge */}
          <div className="flex h-10 items-center gap-2 rounded-2xl bg-orange-50 px-4 text-sm font-medium text-orange-600">
            <Filter className="size-4" />
            Filters
          </div>

          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              placeholder="Search schedules..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-10 rounded-2xl border-slate-200 bg-white pl-10 shadow-none transition-all focus-visible:ring-2 focus-visible:ring-orange-200"
            />
          </div>

          {/* Guard */}
          <Select value={guardId} onValueChange={handleGuardChange}>
            <SelectTrigger className="h-10 w-[180px] rounded-2xl border-slate-200 bg-white shadow-none">
              {isGuardsLoading ? (
                <Loader />
              ) : (
                <SelectValue placeholder="Select Guard" />
              )}
            </SelectTrigger>

            <SelectContent>
              {guards.map((guard) => (
                <SelectItem key={guard.id} value={guard.id}>
                  {guard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Order */}
          <Select value={orderId} onValueChange={handleOrderChange}>
            <SelectTrigger className="h-10 w-[200px] rounded-2xl border-slate-200 bg-white shadow-none">
              {isOrdersLoading ? (
                <Loader />
              ) : (
                <SelectValue placeholder="Select Site" />
              )}
            </SelectTrigger>

            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.locationAddress}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role */}
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-10 w-[160px] rounded-2xl border-slate-200 bg-white shadow-none">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={clearParams}
            className="h-10 rounded-2xl border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50"
          >
            <X className="size-4" />
            Clear
          </Button>

          <AlertListModal />
        </div>
      </div>
    </div>
  );
};

export default SchedulingSearchFilters;