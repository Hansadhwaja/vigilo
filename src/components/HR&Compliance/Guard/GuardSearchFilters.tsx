import { useExportGuardsMutation } from "@/apis/usersApi";
import DataFilters from "@/components/common/Filter/DataFilters";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Download } from "lucide-react";
import { toast } from "sonner";

const GuardSearchFilters = () => {

    const {
        getParam,
        setMultipleParams,
    } = useQueryParams();

    const search = getParam("search", "");

    const [exportGuard, { isLoading: isExporting }] = useExportGuardsMutation();

    const handleExport = async () => {
        try {
            const blob = await exportGuard(undefined).unwrap();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `guard-report-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Guards Exported Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while exporting Guards")
        }
    }

    const handleSearch = (value: string) => {
        setMultipleParams({
            search: value,
            page: "1",
        });
    };

    const clearParams = () => {
        setMultipleParams({
            search: "",
            page: "",
        });
    };

    return (
        <DataFilters
            searchValue={search}
            searchPlaceholder="Search guards..."
            onSearchChange={handleSearch}
            onClear={clearParams}
            filters={[]}
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

export default GuardSearchFilters;