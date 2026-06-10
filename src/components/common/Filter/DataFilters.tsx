"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Filter, Search, X } from "lucide-react";
import { ReactNode } from "react";

interface FilterOption {
    label: ReactNode | string;
    value: string;
}

type SelectFilter = {
    type: "select";
    key: string;
    placeholder: string;
    value: string;
    options: FilterOption[];
    width?: string;
    onChange: (value: string) => void;
};

type DateFilter = {
    type: "date";
    key: string;
    value: string;
    width?: string;
    onChange: (value: string) => void;
};

export type FilterItem = SelectFilter | DateFilter;

interface DataFiltersProps {
    searchValue?: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;

    filters?: FilterItem[];

    onClear?: () => void;
    others?: React.ReactNode;
    searchOnly?: boolean;
}

const DataFilters = ({
    searchValue = "",
    searchPlaceholder = "Search...",
    onSearchChange,
    filters = [],
    onClear,
    others,
    searchOnly = false
}: DataFiltersProps) => {
    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                {/* Left */}
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Badge */}
                    {!searchOnly && (
                        <div className="flex h-10 items-center gap-2 rounded-2xl bg-orange-50 px-4 font-medium text-orange-600">
                            <Filter className="size-4" />
                            Filters
                        </div>
                    )}

                    {/* Search */}
                    {onSearchChange && (
                        <div className="relative min-w-55 max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-10 rounded-2xl border-slate-200 bg-white pl-10 shadow-none transition-all focus-visible:ring-2 focus-visible:ring-orange-200"
                            />
                        </div>
                    )}

                    {filters.map((filter) => {
                        if (filter.type === "date") {
                            return (
                                <Input
                                    key={filter.key}
                                    type="date"
                                    value={filter.value}
                                    onChange={(e) => filter.onChange(e.target.value)}
                                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 shadow-none focus-visible:ring-2 focus-visible:ring-orange-200 max-w-40"
                                />
                            );
                        }

                        return (
                            <Select
                                key={filter.key}
                                value={filter.value}
                                onValueChange={filter.onChange}
                            >
                                <SelectTrigger
                                    className={`h-10 rounded-2xl border-slate-200 bg-white shadow-none ${filter.width || "w-45"
                                        }`}
                                >
                                    <SelectValue placeholder={filter.placeholder} />
                                </SelectTrigger>

                                <SelectContent>
                                    {filter.options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })}
                </div>

                {/* Right */}
                {!searchOnly && onClear && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onClear}
                            className="h-10 rounded-2xl border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50"
                        >
                            <X className="size-4" />
                            Clear
                        </Button>
                    </div>
                )}

                {others && (
                    <div className="flex items-center gap-2 max-sm:w-full max-sm:flex-wrap">
                        {others}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataFilters;