"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceSearchFilters from "./ComplianceSearchFilters";
import ComplianceTable from "./Table/ComplianceTable";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { complianceItems } from "@/constants";
import { useGetAllComplianceQuery } from "@/store/apis/complianceApis";
import { useDebounce } from "@/lib/hooks/useDebounce";

const ComplianceTab = () => {
  const { getParam, setParam } = useQueryParams();

  const limit = getParam("limit", "10");
  const page = getParam("page", "1");
  const search = getParam("search", "");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useGetAllComplianceQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const compliances = data?.data ?? [];

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <Card className="p-0">
      <CardHeader className="p-2 space-y-3">
        <CardTitle className="text-lg">Compliance Tracking</CardTitle>

        <ComplianceSearchFilters />
      </CardHeader>

      <CardContent className="p-2">
        <ComplianceTable
          compliances={compliances}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default ComplianceTab;
