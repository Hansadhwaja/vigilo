import {
  Clock,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  getStatusColor,
  getStatusStyle,
} from "@/utils/statusColors";

import DeleteAssignmentModal from "../../Modal/DeleteAssignmentModal";

import { OrganizedAssignment } from "@/types";

import { cn } from "@/lib/utils";

const AssignmentCard = ({
  assignment,
}: {
  assignment: OrganizedAssignment;
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",

        assignment.type === "patrol"
          ? "border-orange-100"
          : "border-emerald-100"
      )}
    >
      {/* Top Accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",

          assignment.type === "patrol"
            ? "bg-linear-to-r from-orange-400 to-orange-500"
            : "bg-linear-to-r from-emerald-400 to-emerald-500"
        )}
      />

      {/* Actions */}
      <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
        <DeleteAssignmentModal
          id={assignment.shiftId}
        />
      </div>

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3 max-w-[90%]">
        <div className="space-y-2">
          <Badge
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize shadow-none",

              assignment.type ===
              "patrol" &&
              "border-orange-200 bg-orange-50 text-orange-700",

              assignment.type ===
              "static" &&
              "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {assignment.type}
          </Badge>

          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-100">
              <User className="size-4 text-slate-600" />
            </div>

            <div>
              <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                {assignment.guardName}
              </h3>

              <p className="text-sm text-slate-500">
                Security Guard
              </p>
            </div>
          </div>
        </div>

        <Badge
          variant="outline"
          style={getStatusStyle(
            assignment.status
          )}
          className="rounded-full text-[11px] font-medium"
        >
          {
            getStatusColor(
              assignment.status
            ).label
          }
        </Badge>
      </div>

      {/* Time */}
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
        <Clock className="size-4 text-slate-500" />

        <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
          <span>{assignment.start}</span>

          <span className="text-slate-400">
            —
          </span>

          <span>{assignment.end}</span>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">
              {assignment.orderName}
            </p>

            <p className="truncate text-sm text-slate-500">
              {assignment.orderAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />

            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
              {assignment.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;