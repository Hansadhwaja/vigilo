import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryParams } from '@/lib/hooks/useQueryParams';

const IncidentsSearchFilters = () => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const status = getParam("status");
    const search = getParam("search");

    // Search
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
            page: "1",
        })
    }

    const statuses = [
        { label: "Pending", value: "pending" },
        { label: "Resolved", value: "resolved" },
        { label: "In Progress", value: "progress" },
    ];

    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                    placeholder="Search incidents..."
                    className="pl-9 max-w-sm h-8"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Select value={status} onValueChange={(val) => handleStatusChange(val)}>
                <SelectTrigger className="w-36 h-8">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="lg"
                className="h-8"
                onClick={clearParams}
            >
                Clear
            </Button>

        </div>
    )
}

export default IncidentsSearchFilters