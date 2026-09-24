import EditAssignmentModal from "./Modal/EditAssignmentModal";
import { ExternalLink, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizedAssignment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ShiftPill = ({
  assignment,
}: {
  assignment: OrganizedAssignment;
}) => {
  const isPatrol = assignment.type === "patrol";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border p-0 shadow-sm transition-all duration-200 hover:shadow-md",
        isPatrol
          ? "border-orange-200 bg-orange-50"
          : "border-emerald-200 bg-emerald-50",
      )}
    >
      <CardContent className="relative p-0">
        {/* Details Link */}
        <Link
          to={`/scheduling/${assignment.shiftId}?guardId=${assignment.guardId}`}
          className="flex min-w-0 items-center gap-2 p-2.5 pr-16 outline-none"
        >
          {/* Guard Icon */}
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              isPatrol
                ? "bg-orange-100 text-orange-700"
                : "bg-emerald-100 text-emerald-700",
            )}
          >
            <User className="size-3.5" />
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1 leading-tight">
            <p
              className={cn(
                "truncate text-xs font-semibold",
                isPatrol ? "text-orange-950" : "text-emerald-950",
              )}
            >
              {assignment.guardName}
            </p>

            <p
              className={cn(
                "mt-0.5 truncate text-[11px]",
                isPatrol
                  ? "text-orange-700/80"
                  : "text-emerald-700/80",
              )}
            >
              {assignment.start} - {assignment.end}
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div
          className={cn(
            "absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5",
            "opacity-0 transition-opacity duration-150",
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          {/* View */}
          <Link
            to={`/scheduling/${assignment.shiftId}?guardId=${assignment.guardId}`}
            className={cn(
              "flex size-7 items-center justify-center rounded-md transition-colors",
              "hover:bg-white/70",
              isPatrol
                ? "text-orange-700"
                : "text-emerald-700",
            )}
            aria-label="View assignment details"
          >
            <ExternalLink className="size-3.5" />
          </Link>

          {/* Edit */}
          <EditAssignmentModal
            id={assignment.shiftId}
            assignment={assignment}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftPill;