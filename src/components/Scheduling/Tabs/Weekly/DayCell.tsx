import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import CreateAssignmentModal from "../../Modal/CreateAssignmentModal";
import EditAssignmentModal from "../../Modal/EditAssignmentModal";

import { OrganizedAssignment } from "@/types";

import {
    getStatusColor,
    getStatusStyle,
} from "@/utils/statusColors";

interface DayCellProps {
    assignments: OrganizedAssignment[];
    isSelected: boolean;
}

const DayCell = ({
    assignments,
    isSelected,
}: DayCellProps) => {
    return (
        <div
            className={cn(
                "min-h-24 p-2 transition-all duration-200",
                isSelected
                    ? "bg-orange-50/30"
                    : "hover:bg-slate-50/80"
            )}
        >
            {assignments.length > 0 ? (
                <div className="space-y-2">
                    {assignments.map((assignment: OrganizedAssignment) => (
                        <Card
                            key={assignment.id}
                            className={cn(
                                "group overflow-hidden border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                                assignment.type === "patrol"
                                    ? "bg-linear-to-br from-orange-50 to-orange-100/80"
                                    : "bg-linear-to-br from-emerald-50 to-emerald-100/80"
                            )}
                        >
                            <CardContent className="space-y-2 p-3">
                                {/* Top */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-sm font-semibold text-slate-800">
                                            {assignment.guardName}
                                        </h4>

                                        <p className="truncate text-xs text-slate-500">
                                            {assignment.orderName}
                                        </p>
                                    </div>

                                    <div className="lg:opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <EditAssignmentModal
                                            id={assignment.shiftId}
                                            assignment={assignment}
                                        />
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="text-xs font-medium text-slate-600">
                                    {assignment.start} - {assignment.end}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                                        style={getStatusStyle(
                                            assignment.status
                                        )}
                                    >
                                        {
                                            getStatusColor(assignment.status)
                                                .label
                                        }
                                    </Badge>

                                    <div
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            assignment.type === "patrol"
                                                ? "bg-orange-500"
                                                : "bg-emerald-500"
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex h-full min-h-20 items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100">
                    <CreateAssignmentModal title="Add" />
                </div>
            )}
        </div>
    );
};

export default DayCell;