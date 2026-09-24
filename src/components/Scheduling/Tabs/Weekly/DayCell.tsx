import { cn } from "@/lib/utils";

import CreateAssignmentModal from "../../Modal/CreateAssignmentModal";
import { OrganizedAssignment } from "@/types";

import ShiftCard from "./ShiftCard";

interface DayCellProps {
  assignments: OrganizedAssignment[];
  isSelected: boolean;
}

const DayCell = ({ assignments, isSelected }: DayCellProps) => {
  return (
    <div
      className={cn(
        "min-h-24 p-2 transition-all duration-200",
        isSelected ? "bg-orange-50/30" : "hover:bg-slate-50/80",
      )}
    >
      {assignments.length > 0 && (
        <div className="space-y-2">
          {assignments.map((assignment: OrganizedAssignment) => (
            <ShiftCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}

      <div className="flex h-full min-h-20 items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100">
        <CreateAssignmentModal title="Add" />
      </div>
    </div>
  );
};

export default DayCell;
