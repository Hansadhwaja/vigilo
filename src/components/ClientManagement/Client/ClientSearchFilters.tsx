import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientSearchFilters = () => {
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

export default ClientSearchFilters