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
import {
  OrderDetails,
  ShiftDetails,
  ShiftGuard,
} from "@/store/apis/schedulingAPI";

interface ShiftInformationProps {
  shift: ShiftDetails;
  order: OrderDetails;
  guards: ShiftGuard[];
}

const ShiftInformation = ({ shift, order, guards }: ShiftInformationProps) => {
  const start = formatDateTime(shift.startTime);
  const end = formatDateTime(shift.endTime);
  const created = formatDateTime(shift.createdAt);

  const guard = guards[0];

  const information = [
    {
      label: "Date",
      value: start.date,
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: "Time",
      value: `${start.time} — ${end.time}`,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Location",
      value: order.locationName,
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      label: "Assigned Guard",
      value: guard?.name ?? "Unassigned",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: "Guard Status",
      value: guard?.StaticGuards?.status?.replace(/_/g, " ") ?? "Unassigned",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: "Duration",
      value: `${shift.shiftTotalHours} ${
        shift.shiftTotalHours === 1 ? "hr" : "hrs"
      }`,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Service Type",
      value: order.serviceType,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "Shift Type",
      value: shift.type,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "Created At",
      value: `${created.date} • ${created.time}`,
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: "Description",
      value: shift.description,
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <SectionCard
      title="Shift Information"
      icon={<Activity className="h-5 w-5" />}
      description="Schedule and configuration details for this shift"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {information.map((item) => (
          <Info
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
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

    <p className="break-words font-medium capitalize text-foreground">
      {value || "-"}
    </p>
  </div>
);

export default ShiftInformation;
