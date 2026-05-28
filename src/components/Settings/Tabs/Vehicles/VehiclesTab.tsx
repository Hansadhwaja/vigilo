import { Column, DataTable, RowWithId } from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleType } from "@/types";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import VehicleStats from "./VehicleStats";

const VehiclesTab = () => {
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);

  const columns: Column<VehicleType & RowWithId>[] = [
    {
      key: "vehicle",
      header: "Vehicle",

      render: (row) => (
        <div>
          <p className="font-medium">
            {row.type}
          </p>

          <p className="text-sm text-muted-foreground">
            {row.id}
          </p>
        </div>
      ),
    },

    {
      key: "registration",
      header: "Registration",
    },

    {
      key: "status",
      header: "Status",

      render: (row) => (
        <Badge
          variant={
            row.status === "Active"
              ? "default"
              : row.status === "Maintenance"
                ? "secondary"
                : "outline"
          }
        >
          {row.status}
        </Badge>
      ),
    },

    {
      key: "assignedPatrols",
      header: "Assigned Patrols",

      render: (row) =>
        row.assignedPatrols.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.assignedPatrols.map(
              (patrol) => (
                <Badge
                  key={patrol}
                  variant="outline"
                >
                  {patrol}
                </Badge>
              )
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            Unassigned
          </span>
        ),
    },

    {
      key: "nextMaintenance",
      header: "Next Maintenance",
    },

    {
      key: "fuelUsage",
      header: "Fuel Usage",
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",

      render: () => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const vehicles: VehicleType[] = [
    {
      id: "VEH-001",
      type: "Security Van",
      registration: "VIG-001",
      status: "Active",
      assignedPatrols: [
        "North Patrol",
        "East Patrol",
      ],
      nextMaintenance: "15 Jun 2026",
      fuelUsage: "120L",
    },
    {
      id: "VEH-002",
      type: "Patrol Car",
      registration: "VIG-002",
      status: "Maintenance",
      assignedPatrols: [],
      nextMaintenance: "02 Jun 2026",
      fuelUsage: "95L",
    },
    {
      id: "VEH-003",
      type: "Response Vehicle",
      registration: "VIG-003",
      status: "Active",
      assignedPatrols: ["South Patrol"],
      nextMaintenance: "28 Jun 2026",
      fuelUsage: "140L",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Vehicle Management
          </h2>

          <p className="text-muted-foreground">
            Manage fleet vehicles,
            maintenance, and assignments
          </p>
        </div>

        <Button
          onClick={() =>
            setShowAddVehicleDialog(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <VehicleStats />

      <DataTable
        columns={columns}
        data={vehicles}
        emptyText="No vehicles found"
      />

      {/* <AddVehicleDialog
        open={showAddVehicleDialog}
        onOpenChange={
          setShowAddVehicleDialog
        }
      /> */}
    </div>
  );
};

export default VehiclesTab;