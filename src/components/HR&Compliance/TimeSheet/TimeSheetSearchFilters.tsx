import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Guard } from '@/apis/guardsApi';
import Loader from '@/components/common/Loader';
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { Label } from '@/components/ui/label';

interface TimeSheetSearchFiltersProps {
    guards: Guard[];
    isGuardsLoading: boolean;
}

const TimeSheetSearchFilters = ({
    guards,
    isGuardsLoading,
}: TimeSheetSearchFiltersProps) => {
    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const guardId = getParam("guardId");
    const search = getParam("search");
    const fromDate = getParam("fromDate");
    const toDate = getParam("toDate");

    // Search
    const handleSearch = (
        value: string
    ) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleGuardChange = (
        value: string
    ) => {
        setMultipleParams({
            guardId: value,
            page: "1",
        });
    };

    const handleFromDateChange = (
        value: string
    ) => {
        setMultipleParams({
            fromDate: value,
            page: "1",
        });
    };

    const handleToDateChange = (
        value: string
    ) => {
        setMultipleParams({
            toDate: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            guardId: "",
            page: "1",
            fromDate: "",
            toDate: ""
        })
    }

    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                    placeholder="Search clients..."
                    className="pl-9 w-40 h-8"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Select value={guardId} onValueChange={(val) => handleGuardChange(val)}>
                <SelectTrigger className="w-36 h-8">
                    {isGuardsLoading ? <Loader /> : (<SelectValue placeholder="Select Guard" />)}
                </SelectTrigger>
                <SelectContent>
                    {guards.map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex gap-1 items-center">
                <div className="flex gap-1 items-center">
                    <Label>From</Label>
                    <Input
                        type="date"
                        placeholder='Start Date'
                        value={fromDate}
                        onChange={(e) => handleFromDateChange(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <Label>To</Label>
                    <Input
                        type="date"
                        placeholder='End Date'
                        value={toDate}
                        onChange={(e) => handleToDateChange(e.target.value)}
                    />
                </div>
            </div>
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

export default TimeSheetSearchFilters