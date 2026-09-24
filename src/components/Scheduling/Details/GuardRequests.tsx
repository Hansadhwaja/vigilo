import { FileText } from "lucide-react";
import SectionCard from "@/components/common/Card/SectionCard";
import type { GuardDetails } from "@/store/apis/schedulingAPI";
import RequestCard from "./RequestCard";

interface GuardRequestsProps {
  guard?: GuardDetails;
}

const GuardRequests = ({ guard }: GuardRequestsProps) => {
  const assignment = guard?.assignment;

  const hasTimeOffRequest =
    !!assignment?.requestOffStatus && assignment.requestOffStatus !== "none";

  const hasShiftChangeRequest = !!assignment?.changeShiftStatus;

  const hasRequests = hasTimeOffRequest || hasShiftChangeRequest;

  return (
    <SectionCard
      title="Guard Requests"
      icon={<FileText className="h-5 w-5" />}
      description={
        guard
          ? `Requests submitted by ${guard.name}`
          : "Requests submitted by the assigned guard"
      }
    >
      {!hasRequests ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {hasTimeOffRequest && assignment && (
            <RequestCard
              type="time-off"
              assignmentId={assignment.id}
              guardName={guard?.name ?? "-"}
              status={assignment.requestOffStatus}
              date={assignment.requestOffDate}
              reason={assignment.requestOffReason}
              createdAt={assignment.updatedAt}
            />
          )}

          {hasShiftChangeRequest && assignment && (
            <RequestCard
              type="shift-change"
              assignmentId={assignment.id}
              guardName={guard?.name ?? "-"}
              status={assignment.changeShiftStatus ?? "pending"}
              date={assignment.changeShiftDate}
              startTime={assignment.changeShiftStartTime}
              endTime={assignment.changeShiftEndTime}
              reason={assignment.changeShiftReason}
              createdAt={assignment.changeShiftRequestedAt}
            />
          )}
        </div>
      )}
    </SectionCard>
  );
};

const EmptyState = () => (
  <div className="rounded-xl border border-dashed border-border/70 px-6 py-10 text-center">
    <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />

    <p className="mt-3 text-sm font-medium text-foreground">
      No guard requests
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      This guard has no time-off or shift change requests for this shift.
    </p>
  </div>
);

export default GuardRequests;
