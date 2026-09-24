import { formatDate } from "@/lib/utils";
import { Bell, CalendarDays, ChevronRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import CustomBadge from "../common/Badge/CustomBadge";
import { ShiftChangeRequest } from "@/store/apis/schedulingAPI";

interface Props {
  request: ShiftChangeRequest;
}

const ShiftChangeCard = ({ request }: Props) => {
  const requestedDate = request.changeShiftRequestedAt
    ? formatDate(request.changeShiftRequestedAt)
    : "-";

  return (
    <Link
      to={`/scheduling/${request.static.id}?guardId=${request.guard.id}`}
      key={request.id}
      className="group flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Bell className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            Shift change request
          </p>

          <CustomBadge status={request?.changeShiftStatus ?? "pending"} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {request.guard.name}
          </span>

          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {request.changeShiftDate}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {request.changeShiftStartTime} - {request.changeShiftEndTime}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Submitted on {requestedDate}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
};

export default ShiftChangeCard;
