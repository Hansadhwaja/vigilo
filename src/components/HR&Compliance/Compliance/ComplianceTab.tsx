import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import React from 'react'
import ComplianceSearchFilters from './ComplianceSearchFilters';
import ComplianceTable from './Table/ComplianceTable';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useQueryParams } from '@/lib/hooks/useQueryParams';
import { complianceItems } from '@/constants';

const ComplianceTab = () => {
    const {
        getParam,
        setParam,
        setMultipleParams,
    } = useQueryParams();

    const page = Number(getParam("page", "1"));
    const limit = Number(getParam("limit", "10"));
    const search = getParam("search");
    const debouncedSearch = useDebounce(search, 500);

    const pagination = {
        page: 1,
        totalPages: 1
    };

    // Search
    const handleSearch = (
        value: string
    ) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleServiceChange = (
        value: string
    ) => {
        setMultipleParams({
            serviceType: value,
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

    // Pagination
    const handlePageChange = (
        newPage: number
    ) => {
        setParam("page", String(newPage));
    };

    // Limit
    const handleLimitChange = (
        value: number
    ) => {
        setMultipleParams({
            limit: String(value),
            page: "1",
        });
    };

    return (
        <Card className='p-0'>
            <CardHeader className="p-2">
                <CardTitle className="text-lg">Compliance Tracking</CardTitle>
                <ComplianceSearchFilters />
            </CardHeader>
            <CardContent className="p-2">
                <ComplianceTable
                    compliances={complianceItems}
                    page={pagination?.page || 1}
                    totalPages={Number(pagination?.totalPages) || 1}
                    limit={limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={false}
                />
            </CardContent>
        </Card>
    )
}

export default ComplianceTab