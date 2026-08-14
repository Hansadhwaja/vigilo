import {
  Column,
  DataTable,
  RowWithId,
} from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/types";
import EditVehicleModal from "../Modal/EditVehicleModal";
import DeleteVehicleModal from "../Modal/DeleteVehicleModal";
import ViewVehicleModal from "../Modal/ViewVehicleModal";
import { VehicleType } from "@/types/vehicle";

interface Props {
  vehicles: VehicleType[];
  pagination: Pagination;
  onPageChange: (n: number) => void;
  onLimitChange: (n: number) => void;
}

const VehicleTable = ({
  vehicles,
  pagination,
  onLimitChange,
  onPageChange,
}: Props) => {
  const columns: Column<VehicleType & RowWithId>[] = [
    {
      key: "id",
      header: "S.No",

      render: (_, idx) => idx + 1,
    },
    {
      key: "vehicle",
      header: "Vehicle",

      render: (row) => (
        <div>
          <p className="font-medium capitalize">{row.name}</p>

          <p className="text-sm text-muted-foreground capitalize">{row.type}</p>
        </div>
      ),
    },

    {
      key: "plateNumber",
      header: "Plate Number",
    },

    {
      key: "status",
      header: "Status",

      render: (row) => (
        <Badge
          className="capitalize"
          variant={
            row.status === "active"
              ? "default"
              : row.status === "maintenance"
                ? "secondary"
                : "outline"
          }
        >
          {row.status}
        </Badge>
      ),
    },

    // {
    //   key: "assignedPatrols",
    //   header: "Assigned Patrols",

    //   render: (row) =>
    //     (row.assignedPatrols ?? [])?.length > 0 ? (
    //       <div className="flex flex-wrap gap-1">
    //         {row.assignedPatrols.map((patrol) => (
    //           <Badge key={patrol} variant="outline">
    //             {patrol}
    //           </Badge>
    //         ))}
    //       </div>
    //     ) : (
    //       <span className="text-sm text-muted-foreground">Unassigned</span>
    //     ),
    // },

    // {
    //   key: "nextMaintenance",
    //   header: "Next Maintenance",
    // },

    // {
    //   key: "fuelUsage",
    //   header: "Fuel Usage",
    // },

    {
      key: "actions",
      header: "Actions",
      align: "center",

      render: (row) => (
        <div className="flex justify-center gap-2">
          <ViewVehicleModal id={row.id} />

          <EditVehicleModal vehicle={row} />

          <DeleteVehicleModal id={row.id} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={vehicles}
        emptyText="No vehicles found"
        page={pagination.currentPage}
        totalPages={pagination.totalPages}
        limit={pagination.itemsPerPage}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
};

export default VehicleTable;
