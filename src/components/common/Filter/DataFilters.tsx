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

interface FilterOption {
    label: string;
    value: string;
}

interface SelectFilter {
    key: string;
    placeholder: string;
    value: string;
    options: FilterOption[];
    width?: string;
    onChange: (value: string) => void;
}

interface DataFiltersProps {
    searchValue?: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;

    filters?: SelectFilter[];

    onClear?: () => void;
    others?: React.ReactNode;
}

const DataFilters = ({
    searchValue = "",
    searchPlaceholder = "Search...",
    onSearchChange,
    filters = [],
    onClear,
    others
}: DataFiltersProps) => {
    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                {/* Left */}
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* Badge */}
                    <div className="flex h-10 items-center gap-2 rounded-2xl bg-orange-50 px-4 text-sm font-medium text-orange-600">
                        <Filter className="size-4" />
                        Filters
                    </div>

                    {/* Search */}
                    {onSearchChange && (
                        <div className="relative min-w-[220px] max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-10 rounded-2xl border-slate-200 bg-white pl-10 shadow-none transition-all focus-visible:ring-2 focus-visible:ring-orange-200"
                            />
                        </div>
                    )}

                    {/* Dynamic Select Filters */}
                    {filters.map((filter) => (
                        <Select
                            key={filter.key}
                            value={filter.value}
                            onValueChange={filter.onChange}
                        >
                            <SelectTrigger
                                className={`h-10 rounded-2xl border-slate-200 bg-white shadow-none ${filter.width || "w-[180px]"
                                    }`}
                            >
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>

                            <SelectContent>
                                {filter.options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                </div>

                {/* Right */}
                {onClear && (
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