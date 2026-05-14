import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const PatrollingSearchFilters = () => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const status = getParam("status");
    const search = getParam("search");

    const handleSearch = (
        value: string
    ) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleStatusChange = (
        value: string
    ) => {
        setMultipleParams({
            status: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            status: "",
            search: "",
            page: "1",
        });
    };

    const statuses = [
        { label: "Accepted", value: "accepted" },
        { label: "Rejected", value: "rejected" },
        { label: "Pending", value: "pending" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Delayed", value: "delayed" },
        { label: "Absent", value: "absent" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
    ];

    return (
        <div
            className="
                flex flex-col gap-3
                rounded-2xl
                border border-slate-200
                bg-white/90
                p-4
                shadow-sm
                backdrop-blur
                sm:flex-row
                sm:items-center
            "
        >

            <div className="flex items-center gap-2 shrink-0">
                <div
                    className="
                        flex h-9 w-9 items-center justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <Filter className="h-4 w-4" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Filters
                    </p>

                    <p className="text-xs text-slate-500">
                        Search and refine Patrolling
                    </p>
                </div>
            </div>

            <div className="relative flex-1 min-w-60">
                <Search
                    className="
                        absolute left-3 top-1/2
                        h-4 w-4
                        -translate-y-1/2
                        text-slate-400
                    "
                />

                <Input
                    placeholder="Search Patrolling..."
                    className="
                        h-11
                        rounded-xl
                        border-slate-200
                        bg-slate-50/70
                        pl-10
                        shadow-none
                        focus-visible:ring-2
                        focus-visible:ring-blue-100
                    "
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <Select
                value={status}
                onValueChange={(val) => handleStatusChange(val)}
            >
                <SelectTrigger
                    className="
                        w-full
                        rounded-xl
                        border-slate-200
                        bg-slate-50/70
                        shadow-none
                        sm:w-45
                    "
                >
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-slate-200">
                    {statuses.map((s) => (
                        <SelectItem
                            key={s.value}
                            value={s.value}
                            className="rounded-lg"
                        >
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={clearParams}
                className="
                    h-11
                    rounded-xl
                    border-slate-200
                    bg-white
                    px-4
                    hover:bg-slate-50
                "
            >
                <X className="mr-2 h-4 w-4" />
                Clear
            </Button>
        </div>
    );
};

export default PatrollingSearchFilters;