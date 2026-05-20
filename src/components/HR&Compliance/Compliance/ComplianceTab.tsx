"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceSearchFilters from "./ComplianceSearchFilters";
import ComplianceTable from "./Table/ComplianceTable";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { complianceItems } from "@/constants";

const ComplianceTab = () => {
    const { getParam, setParam } = useQueryParams();

    const limit = Number(getParam("limit", "10"));

    const pagination = {
        page: 1,
        totalPages: 1,
    };

    const handlePageChange = (newPage: number) => {
        setParam("page", String(newPage));
    };

    const handleLimitChange = (value: number) => {
        setParam("limit", String(value));
        setParam("page", "1");
    };

    return (
        <Card className="p-0">
            <CardHeader className="p-2 space-y-3">
                <CardTitle className="text-lg">
                    Compliance Tracking
                </CardTitle>

                <ComplianceSearchFilters />
            </CardHeader>

            <CardContent className="p-2">
                <ComplianceTable
                    compliances={complianceItems}
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    limit={limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={false}
                />
            </CardContent>
        </Card>
    );
};

export default ComplianceTab;