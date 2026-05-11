import { Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  order: any;
}

const formatDate = (iso?: string) => {
  if (!iso) return "—";

  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};

const formatTime = (isoOrTime?: string) => {
  if (!isoOrTime) return "—";

  try {
    const d = new Date(isoOrTime);

    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {}

  return isoOrTime;
};

const ScheduleCard = ({ order }: Props) => {
  return (
    <Card className="border-2 border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b-2 border-gray-200 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
          <Clock className="h-6 w-6" />
          Schedule
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">

        <InfoItem
          label="Start Date"
          value={formatDate(order.startDate)}
        />

        <InfoItem
          label="End Date"
          value={formatDate(order.endDate)}
        />

        <Separator />

        <InfoItem
          label="Start Time"
          value={formatTime(order.startTime)}
        />

        <InfoItem
          label="End Time"
          value={formatTime(order.endTime)}
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
}

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div>
      <Label className="text-base font-semibold text-gray-900 mb-2 block">
        {label}
      </Label>

      <div className="text-base text-gray-700">
        {value || "—"}
      </div>
    </div>
  );
};