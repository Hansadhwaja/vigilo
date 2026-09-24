import { OrganizedAssignment } from "@/types";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditAssignmentModal from "../../Modal/EditAssignmentModal";
import DeleteAssignmentModal from "../../Modal/DeleteAssignmentModal";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CustomBadge from "@/components/common/Badge/CustomBadge";

interface Props {
  assignment: OrganizedAssignment;
}

const ShiftCard = ({ assignment }: Props) => {
  const isPatrol = assignment.type === "patrol";

  return (
    <Card
      className={cn(
        "group overflow-hidden border p-0 shadow-sm transition-all duration-200 hover:shadow-md",
        isPatrol
          ? "border-orange-200/70 bg-orange-50/60"
          : "border-emerald-200/70 bg-emerald-50/60",
      )}
    >
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div
            className={cn(
              "mt-0.5 h-2 w-2 shrink-0 rounded-full",
              isPatrol ? "bg-orange-500" : "bg-emerald-500",
            )}
          />

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold leading-5 text-slate-800">
              {assignment.guardName}
            </h4>

            <p className="mt-0.5 truncate text-xs leading-4 text-slate-500">
              {assignment.orderName}
            </p>
          </div>
        </div>

        {/* Time + Status */}
        <div className="mt-3 flex items-center justify-between gap-2 flex-col">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-slate-700">
              {assignment.start}
              <span className="mx-1 text-slate-400">–</span>
              {assignment.end}
            </p>
          </div>

          <CustomBadge status={assignment.status} />
        </div>

        {/* Actions */}
        <div
          className={cn(
            "grid grid-cols-3 gap-1 overflow-hidden border-t transition-all duration-200",
            "mt-3 max-h-0 border-transparent pt-0 opacity-0",
            "group-hover:max-h-10 group-hover:border-slate-200/70 group-hover:pt-2 group-hover:opacity-100",
            "group-focus-within:max-h-10 group-focus-within:border-slate-200/70 group-focus-within:pt-2 group-focus-within:opacity-100",
          )}
        >
          <Button
            asChild
            size="icon-sm"
            variant="secondary"
            className="text-slate-600 hover:bg-white/70 hover:text-slate-800"
          >
            <Link
              to={`/scheduling/${assignment.shiftId}?guardId=${assignment.guardId}`}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>

          <EditAssignmentModal
            id={assignment.shiftId}
            assignment={assignment}
          />

          <DeleteAssignmentModal id={assignment.shiftId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
