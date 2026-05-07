import { Clock, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import DeleteAssignmentModal from "./Modal/DeleteAssignmentModal";
import { OrganizedAssignment } from "@/types";
import { cn } from "@/lib/utils";

const AssignmentCard = ({
  assignment,
}: {
  assignment: OrganizedAssignment;
}) => {
  return (
    <div className="group relative p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition">

      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
        <DeleteAssignmentModal id={assignment.shiftId} />
      </div>

      <div className="flex justify-between mb-2">
        <Badge
          className={cn(
            "text-xs capitalize",
            assignment.type === "patrol"
              ? "bg-orange-100 text-orange-700"
              : "bg-green-100 text-green-700"
          )}
        >
          {assignment.type}
        </Badge>

        <Badge
          variant="outline"
          style={getStatusStyle(assignment.status)}
        >
          {getStatusColor(assignment.status).label}
        </Badge>
      </div>

      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <User className="h-4 w-4 text-gray-500" />
        {assignment.guardName}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
        <Clock className="h-4 w-4" />
        {assignment.start} - {assignment.end}
      </div>

      <div className="text-sm mt-2 text-gray-700 truncate">
        📍 {assignment.orderName}
      </div>

      <div className="text-xs text-gray-500 truncate">
        {assignment.orderAddress}
      </div>

      {assignment.description && (
        <div className="text-sm text-gray-600 border-t mt-2 pt-2">
          {assignment.description}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;