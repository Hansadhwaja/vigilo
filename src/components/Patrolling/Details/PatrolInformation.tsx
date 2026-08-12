import {
  Activity,
  CalendarDays,
  Car,
  Clock,
} from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { formatDateTime } from "@/lib/utils";

interface PatrolInformationProps {
  patrol: any;
}

const PatrolInformation = ({
  patrol,
}: PatrolInformationProps) => {
  const start = formatDateTime(patrol.startTime);
  const estimated = formatDateTime(
    patrol.estimatedCompletion
  );
  const created = formatDateTime(patrol.createdAt);

  return (
    <SectionCard
      title="Patrol Information"
      icon={<Activity className="h-5 w-5" />}
      description="Details and schedule information for this patrol run"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Info
          label="Description"
          value={patrol.description}
        />

        <DateTimeInfo
          label="Start Time"
          date={start.date}
          time={start.time}
          icon={<CalendarDays className="h-4 w-4" />}
        />

        <DateTimeInfo
          label="Estimated Completion"
          date={estimated.date}
          time={estimated.time}
          icon={<Clock className="h-4 w-4" />}
        />

        <DateTimeInfo
          label="Created At"
          date={created.date}
          time={created.time}
          icon={<CalendarDays className="h-4 w-4" />}
        />

        <Info
          label="Vehicle ID"
          value={patrol.vehicleId}
          icon={<Car className="h-4 w-4" />}
        />
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
  <div>
    <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>

    <p className="font-medium text-slate-800">
      {value || "-"}
    </p>
  </div>
);

const DateTimeInfo = ({
  label,
  date,
  time,
  icon,
}: {
  label: string;
  date: string;
  time: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <div className="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>

    <div className="flex items-center gap-2">
      <p className="font-medium text-slate-800">
        {date}
      </p>

      <span className="text-slate-300">•</span>

      <p className="font-medium text-slate-800">
        {time}
      </p>
    </div>
  </div>
);

export default PatrolInformation;