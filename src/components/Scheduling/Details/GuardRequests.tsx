import { Check, Clock3, FileText, RefreshCw, UserRound, X } from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { Button } from "@/components/ui/button";
import type {
  ShiftChangeRequest,
  TimeOffRequest,
} from "@/store/apis/schedulingAPI";

interface GuardTimeOffRequest extends TimeOffRequest {
  guardId: string;
  guardName: string;
  guardCode?: string;
}

interface GuardRequestsProps {
  timeOffRequests: GuardTimeOffRequest[];
  shiftChangeRequests: ShiftChangeRequest[];
}

const GuardRequests = ({
  timeOffRequests,
  shiftChangeRequests,
}: GuardRequestsProps) => {
  const totalRequests = timeOffRequests.length + shiftChangeRequests.length;

  return (
    <SectionCard
      title="Guard Requests"
      icon={<FileText className="h-5 w-5" />}
      description="Review time-off and shift change requests for this shift"
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RequestSummary
            label="Time-Off Requests"
            count={timeOffRequests.length}
            icon={<Clock3 className="h-4 w-4" />}
          />

          <RequestSummary
            label="Shift Change Requests"
            count={shiftChangeRequests.length}
            icon={<RefreshCw className="h-4 w-4" />}
          />
        </div>

        {/* Time-Off Requests */}
        {timeOffRequests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Time-Off Requests
            </h4>

            <div className="overflow-hidden rounded-xl border border-border/60">
              {/* Table Header */}
              <div className="hidden grid-cols-[1.5fr_1.2fr_2fr_1fr_0.8fr_auto] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
                <span>Guard</span>
                <span>Requested Off</span>
                <span>Reason</span>
                <span>Submitted</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {timeOffRequests.map((request) => (
                <TimeOffRequestRow key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Shift Change Requests */}
        {shiftChangeRequests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Shift Change Requests
            </h4>

            <div className="space-y-3">
              {shiftChangeRequests.map((request) => (
                <ShiftChangeRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalRequests === 0 && <EmptyState />}
      </div>
    </SectionCard>
  );
};

const RequestSummary = ({
  label,
  count,
  icon,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
          {icon}
        </div>

        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>

      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-foreground px-2 text-xs font-semibold text-background">
        {count}
      </span>
    </div>
  );
};

const TimeOffRequestRow = ({ request }: { request: GuardTimeOffRequest }) => {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-border/60 px-4 py-4 md:grid-cols-[1.5fr_1.2fr_2fr_1fr_0.8fr_auto] md:items-center">
      {/* Guard */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {getInitials(request.guardName)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {request.guardName}
          </p>

          {request.guardCode && (
            <p className="text-xs text-muted-foreground">{request.guardCode}</p>
          )}
        </div>
      </div>

      {/* Requested Off */}
      <div>
        <p className="text-sm font-medium text-foreground">
          {formatDate(request.startDate)}
        </p>

        <p className="text-xs text-muted-foreground">
          {request.startDate === request.endDate
            ? "Entire shift"
            : `Until ${formatDate(request.endDate)}`}
        </p>
      </div>

      {/* Reason */}
      <p className="text-sm leading-5 text-muted-foreground">
        {request.reason || "-"}
      </p>

      {/* Submitted */}
      <p className="text-sm text-muted-foreground">
        {formatRelativeTime(request.createdAt)}
      </p>

      {/* Status */}
      <RequestStatus status={request.status} />

      {/* Actions */}
      <RequestActions />
    </div>
  );
};

const ShiftChangeRequestCard = ({
  request,
}: {
  request: ShiftChangeRequest;
}) => (
  <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />

            <p className="text-sm font-semibold text-foreground">
              Shift Change Request
            </p>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Guard information unavailable
          </p>
        </div>

        <RequestStatus status={request.status} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TimeBox
          label="Requested Start"
          value={request.requestedStartTime ?? "-"}
        />

        <TimeBox
          label="Requested End"
          value={request.requestedEndTime ?? "-"}
          highlighted
        />
      </div>

      <div>
        <p className="text-sm leading-6 text-muted-foreground">
          {request.reason || "-"}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          Submitted {formatRelativeTime(request.createdAt)}
        </p>
      </div>

      <RequestActions />
    </div>
  </div>
);

const TimeBox = ({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) => {
  return (
    <div
      className={[
        "rounded-lg border px-3 py-2.5",
        highlighted
          ? "border-primary/20 bg-primary/5"
          : "border-border/60 bg-background",
      ].join(" ")}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
};

const RequestStatus = ({ status }: { status: string }) => {
  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
      {status || "pending"}
    </span>
  );
};

const RequestActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm">
        <Check className="mr-1.5 h-4 w-4" />
        Approve
      </Button>

      <Button size="sm" variant="outline">
        <X className="mr-1.5 h-4 w-4" />
        Reject
      </Button>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="rounded-xl border border-dashed border-border/70 px-6 py-10 text-center">
      <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />

      <p className="mt-3 text-sm font-medium text-foreground">
        No guard requests
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        There are no time-off or shift change requests for this shift.
      </p>
    </div>
  );
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();

  if (diff < 0) return "Just now";

  const hours = Math.floor(diff / 36e5);

  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);

  return days === 1 ? "1 day ago" : `${days} days ago`;
};

export default GuardRequests;
