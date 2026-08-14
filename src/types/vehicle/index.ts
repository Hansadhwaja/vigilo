export type VehicleStatType = {
  active: number;
  inactive: number;
  maintenance: number;
};

export type VehicleTypes = "car" | "van" | "bus";

export type VehicleStatus = "active" | "maintenance" | "inactive";

export interface VehicleType {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  status: VehicleStatus;
  assignedPatrols: string[];
  nextMaintenance: string;
  fuelUsage: string;

  companyAdminId: string;
  createdAt: string;
  updatedAt: string;
}
