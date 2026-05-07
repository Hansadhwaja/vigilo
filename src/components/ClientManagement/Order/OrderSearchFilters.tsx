import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const OrderSearchFilters = () => {
    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                    placeholder="Search orders..."
                    className="pl-9 w-auto h-8"
                />
            </div>
            <Select>
                <SelectTrigger className="w-auto h-8">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-auto h-8">
                    <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="premiumSecurity">Premium Security</SelectItem>
                    <SelectItem value="standardPatrol">Standard Patrol</SelectItem>
                    <SelectItem value="24/7Monitoring">24/7 Monitoring</SelectItem>
                    <SelectItem value="healthcareSecurity">Healthcare Security</SelectItem>
                    <SelectItem value="industrialSecurity">Industrial Security</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="sm"

                className="h-8"
            >
                Clear
            </Button>

        </div>
    )
}

export default OrderSearchFilters