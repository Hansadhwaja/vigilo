import { Clock, ExternalLink, MapPin, ShieldCheck, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteAssignmentModal from "../../Modal/DeleteAssignmentModal";
import { OrganizedAssignment } from "@/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import CustomBadge from "@/components/common/Badge/CustomBadge";

const AssignmentCard = ({
  assignment,
}: {
  assignment: OrganizedAssignment;
}) => {
  const isPatrol = assignment.type === "patrol";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden py-0 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        isPatrol ? "border-orange-100" : "border-emerald-100",
      )}
    >
      {/* Top Accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          isPatrol
            ? "bg-linear-to-r from-orange-400 to-orange-500"
            : "bg-linear-to-r from-emerald-400 to-emerald-500",
        )}
      />

      <CardHeader className="px-4 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            {/* Type */}
            <Badge
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize shadow-none",
                isPatrol
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700",
              )}
            >
              {assignment.type}
            </Badge>

            {/* Guard */}
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  isPatrol ? "bg-orange-50" : "bg-emerald-50",
                )}
              >
                <User
                  className={cn(
                    "size-4",
                    isPatrol ? "text-orange-600" : "text-emerald-600",
                  )}
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {assignment.guardName}
                </h3>

                <p className="text-xs text-slate-500">Security Guard</p>
              </div>
            </div>
          </div>

          <CustomBadge status={assignment.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4">
        {/* Time */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
          <Clock className="size-4 shrink-0 text-slate-500" />

          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <span>{assignment.start}</span>
            <span className="text-slate-400">—</span>
            <span>{assignment.end}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">
              {assignment.orderName}
            </p>

            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500">
              {assignment.orderAddress}
            </p>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />

              <p className="line-clamp-2 text-xs leading-5 text-slate-600">
                {assignment.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between border-t bg-slate-50/50 px-4 py-2.5">
        {/* Details */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-xs",
            isPatrol
              ? "text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
          )}
        >
          <Link
            to={`/scheduling/${assignment.shiftId}?guardId=${assignment.guardId}`}
          >
            View details
            <ExternalLink className="ml-1.5 size-3.5" />
          </Link>
        </Button>

        {/* Delete */}
        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <DeleteAssignmentModal id={assignment.shiftId} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;
