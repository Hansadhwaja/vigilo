import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ComplianceSearchFilters = () => {
    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                    placeholder="Search clients..."
                    className="pl-9 w-40 h-8"
                />
            </div>
            <Select>
                <SelectTrigger className="w-36 h-8">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="lg"
                className="h-8"
            >
                Clear
            </Button>

        </div>
    )
}

export default ComplianceSearchFilters