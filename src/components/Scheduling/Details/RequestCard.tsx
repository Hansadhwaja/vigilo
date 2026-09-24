import { CalendarOff, Check, RefreshCw, X } from "lucide-react";
import TimeBox from "./Timebox";
import { formatDate } from "@/lib/utils";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateStatusOfShiftMutation } from "@/store/apis/schedulingAPI";
import { toast } from "sonner";

interface RequestCardProps {
  type: "time-off" | "shift-change";
  guardName: string;
  status: string;
  date: string | null;
  startTime?: string | null;
  endTime?: string | null;
  reason: string | null;
  createdAt: string | null;
  assignmentId: string;
}

const RequestCard = ({
  type,
  guardName,
  status,
  date,
  startTime,
  endTime,
  reason,
  createdAt,
  assignmentId,
}: RequestCardProps) => {
  const isTimeOff = type === "time-off";
  const canUpdate = status === "pending";
  const [updateStatusOfShift, { isLoading }] = useUpdateStatusOfShiftMutation();

  const handleSubmit = async (value: string) => {
    try {
      await updateStatusOfShift({
        id: assignmentId,
        data: { action: value },
      }).unwrap();
      toast.success(`Shift ${value} successfully`);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.data?.error?.message ?? "Error while updating status";
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {isTimeOff ? (
                <CalendarOff className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <CardTitle className="text-sm">
                {isTimeOff ? "Time-Off Request" : "Shift Change Request"}
              </CardTitle>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {guardName}
              </p>
            </div>
          </div>

          <CustomBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isTimeOff ? (
          <div className="rounded-lg border bg-muted/30 px-3 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Requested Off
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {date ? formatDate(date) : "-"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TimeBox
              label="Requested Date"
              value={date ? formatDate(date) : "-"}
            />

            <TimeBox label="Start Time" value={startTime ?? "-"} />

            <TimeBox label="End Time" value={endTime ?? "-"} highlighted />
          </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Reason
          </p>

          <p className="mt-1 text-sm leading-5 text-foreground">
            {reason || "-"}
          </p>
        </div>

        {createdAt && (
          <p className="text-xs text-muted-foreground">
            Submitted {formatDate(createdAt)}
          </p>
        )}
      </CardContent>

      {canUpdate && (
        <CardFooter className="justify-end gap-2 border-t">
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => handleSubmit("accepted")}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Approve
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleSubmit("rejected")}
          >
            <X className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RequestCard;
