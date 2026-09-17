import {
  Activity,
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  Shield,
} from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { formatDateTime } from "@/lib/utils";

interface ShiftInformationProps {
  shift: Shift;
  order: Order;
  guards: Guard[];
}

interface Shift {
  id: string;
  type: string;
  description: string;
  date: string;
  endDate: string;
  status: string;
  startTime: string;
  endTime: string;
  shiftTotalHours: number;
  createdAt: string;
}

interface Order {
  serviceType: string;
  locationName: string;
  locationAddress: string;
}

interface Guard {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignmentStatus: string;
}

const ShiftInformation = ({ shift, order, guards }: ShiftInformationProps) => {
  const start = formatDateTime(shift.startTime);
  const end = formatDateTime(shift.endTime);
  const created = formatDateTime(shift.createdAt);

  const guard = guards[0];

  return (
    <SectionCard
      title="Shift Information"
      icon={<Activity className="h-5 w-5" />}
      description="Schedule and configuration details for this shift"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {shift.description?.trim() || "Untitled Shift"}
            </h3>

            <span className="mt-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
              {shift.status}
            </span>
          </div>
        </div>

        {/* Main information */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Date"
            value={start.date}
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <Info
            label="Time"
            value={`${start.time} — ${end.time}`}
            icon={<Clock className="h-4 w-4" />}
          />

          <Info
            label="Location"
            value={order.locationName}
            icon={<MapPin className="h-4 w-4" />}
          />

          <Info
            label="Assigned Guard"
            value={guard ? `${guard.name} · ${guard.phone}` : "Unassigned"}
            icon={<Shield className="h-4 w-4" />}
          />

          <Info
            label="Duration"
            value={`${shift.shiftTotalHours} ${
              shift.shiftTotalHours === 1 ? "hr" : "hrs"
            }`}
            icon={<Clock className="h-4 w-4" />}
          />

          <Info
            label="Service Type"
            value={order.serviceType}
            icon={<Activity className="h-4 w-4" />}
          />

          <Info
            label="Shift Type"
            value={shift.type}
            icon={<Activity className="h-4 w-4" />}
          />

          <Info
            label="Created At"
            value={`${created.date} • ${created.time}`}
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <Info
            label="Description"
            value={shift.description}
            icon={<FileText className="h-4 w-4" />}
          />
        </div>
      </div>
    </SectionCard>
  );
};

const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) => (
  <div className="min-w-0">
    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>

    <p className="break-words font-medium text-foreground">{value || "-"}</p>
  </div>
);

export default ShiftInformation;
