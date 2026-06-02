"use client";

import DataFilters, { FilterItem } from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Guard } from "@/apis/guardsApi";
import { useExportTimeSheetsMutation } from "@/apis/schedulingAPI";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { Download } from "lucide-react";

interface TimeSheetSearchFiltersProps {
    guards: Guard[];
    isGuardsLoading: boolean;
}

const TimeSheetSearchFilters = ({
    guards,
}: TimeSheetSearchFiltersProps) => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search", "");
    const guardId = getParam("guardId", "");
    const fromDate = getParam("fromDate", "");
    const toDate = getParam("toDate", "");

    const [exportTimeSheet, { isLoading: isExporting }] = useExportTimeSheetsMutation();

    const handleExport = async () => {
        try {
            const blob = await exportTimeSheet(undefined).unwrap();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `time-sheet-report-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Time Sheets Exported Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while exporting Time Sheets")
        }
    }

    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const handleGuardChange = (value: string) => {
        setMultipleParams({
            guardId: value,
            page: "1",
        });
    };

    const handleFromDateChange = (value: string) => {
        setMultipleParams({
            fromDate: value,
            page: "1",
        });
    };

    const handleToDateChange = (value: string) => {
        setMultipleParams({
            toDate: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            search: "",
            guardId: "",
            fromDate: "",
            toDate: "",
            page: "",
        });
    };

    const filters = [
        {
            key: "guardId",
            type: "select",
            placeholder: "Select Guard",
            value: guardId,
            options: guards.map((g) => ({
                label: g.name,
                value: g.id,
            })),
            onChange: handleGuardChange,
            width: "w-[200px]",
        },
        {
            key: "fromDate",
            type: "date",
            value: fromDate,
            onChange: handleFromDateChange,
        },
        {
            key: "toDate",
            type: "date",
            value: toDate,
            onChange: handleToDateChange,
        },
    ] satisfies FilterItem[];

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search timesheets..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={filters}
            others={
                <div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleExport}
                        disabled={isExporting}
                    >

                        {isExporting ? <Loader /> : (
                            <>
                                <Download className="h-4 w-4" />
                                Export
                            </>


                        )}
                    </Button>
                </div>
            }
        />
    );
};

export default TimeSheetSearchFilters;