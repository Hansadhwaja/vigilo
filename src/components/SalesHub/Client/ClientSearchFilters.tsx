import { useExportUsersMutation } from "@/apis/usersApi";
import DataFilters from "@/components/common/Filter/DataFilters";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { Download } from "lucide-react";
import { toast } from "sonner";

const ClientSearchFilters = () => {
    const { getParam, setMultipleParams } = useQueryParams();

    const search = getParam("search");

    const [exportUser, { isLoading: isExporting }] = useExportUsersMutation();

    const handleExport = async () => {
        try {
            const blob = await exportUser(undefined).unwrap();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `user-report-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.success("Users Exported Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error while exporting Users")
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
            searchPlaceholder="Search clients..."
            onSearchChange={handleSearch}
            onClear={clearParams}
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

export default ClientSearchFilters;