import React, { useState } from "react";
import { Button } from "../ui/button";
import AlertListModal from "./Modal/AlertListModal";
import { Filter, X } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Order } from "@/apis/ordersApi";
import { Guard } from "@/apis/guardsApi";

interface SearchFiltersProps {
  orders: Order[];
  guards: Guard[];
}

const SearchFilters = ({ orders = [], guards = [] }: SearchFiltersProps) => {
  const [filterOrder, setFilterOrder] = useState("all");
  const [filterGuard, setFilterGuard] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const hasActiveFilters =
    filterOrder !== "all" ||
    filterGuard !== "all" ||
    filterRole !== "all" ||
    searchTerm.length > 0;

  const clearFilters = () => {
    setFilterOrder("all");
    setFilterGuard("all");
    setFilterRole("all");
    setSearchTerm("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">

      {/* LEFT - FILTER PANEL */}
      <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-5 gap-2 p-3 bg-white border rounded-xl shadow-sm">

        {/* Search */}
        <div className="md:col-span-2 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search shifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>

        {/* Order */}
        <Select value={filterOrder} onValueChange={setFilterOrder}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {orders.map((order) => (
              <SelectItem key={order.id} value={order.id}>
                {order.locationAddress}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Guard */}
        <Select value={filterGuard} onValueChange={setFilterGuard}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Guard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guards</SelectItem>
            {guards.map((guard) => (
              <SelectItem key={guard.id} value={guard.id}>
                {guard.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role */}
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="static">Static</SelectItem>
            <SelectItem value="patrol">Patrol</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* RIGHT - ACTIONS */}
      <div className="lg:col-span-2 flex justify-end">
        <AlertListModal />
      </div>
    </div>
  );
};

export default SearchFilters;