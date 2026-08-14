import VehicleTable from "./Table/VehicleTable";
import { useGetAllVehiclesQuery } from "@/store/apis/vehiclesApi";
import Loader from "@/components/common/Loader";
import AddVehicleModal from "./Modal/AddVehicleModal";
import { Pagination } from "@/types";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { VehicleStatType } from "@/types/vehicle";
import VehicleStats from "./VehicleStats";

const VehiclesTab = () => {
  const { getParam, setParam, setMultipleParams } = useQueryParams();

  const page = Number(getParam("page", "1"));
  const limit = Number(getParam("limit", "10"));
  const { data, isLoading } = useGetAllVehiclesQuery({
    page,
    limit,
  });
  const vehicles = data?.data ?? [];
  const pagination: Pagination = data?.pagination ?? {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  };

  const stats: VehicleStatType = data?.stats ?? {
    active: 0,
    inactive: 0,
    maintenance: 0,
  };

  const handlePageChange = (newPage: number) => {
    setParam("page", String(newPage));
  };

  // Limit
  const handleLimitChange = (value: number) => {
    setMultipleParams({
      limit: String(value),
      page: "1",
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Vehicle Management</h2>

          <p className="text-muted-foreground">
            Manage fleet vehicles, maintenance, and assignments
          </p>
        </div>

        <AddVehicleModal />
      </div>

      <VehicleStats stats={stats} />
      <VehicleTable
        vehicles={vehicles}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};

export default VehiclesTab;
