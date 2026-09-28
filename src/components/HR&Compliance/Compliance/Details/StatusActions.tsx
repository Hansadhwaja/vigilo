import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { StatusAction } from "@/types/compliance/compliance.types";

interface StatusActionsProps {
  status?: string | null;
  onStatusChange: (status: StatusAction) => void;
  approveLabel?: string;
  rejectLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

const StatusActions = ({
  status = "Pending",
  onStatusChange,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  disabled = false,
  loading = false,
}: StatusActionsProps) => {
  const currentStatus = status || "Pending";

  const isApproved = currentStatus === "Approved";
  const isRejected = currentStatus === "Rejected";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CustomBadge status={currentStatus} />

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled || loading || isApproved}
        onClick={() => onStatusChange("Approved")}
        className="h-8 gap-1.5"
      >
        <Check className="size-3.5" />
        {approveLabel}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled || loading || isRejected}
        onClick={() => onStatusChange("Rejected")}
        className="h-8 gap-1.5"
      >
        <X className="size-3.5" />
        {rejectLabel}
      </Button>
    </div>
  );
};

export default StatusActions;
