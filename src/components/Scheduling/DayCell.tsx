
import { cn } from "@/lib/utils";
import CreateAssignmentModal from "./Modal/CreateAssignmentModal";
import EditAssignmentModal from "./Modal/EditAssignmentModal";
import { Badge } from "../ui/badge";
import { OrganizedAssignment } from "@/types";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { Card, CardContent } from "../ui/card";

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
                "p-2 border-r min-h-20 transition-all",
                isSelected ? "bg-blue-50" : "hover:bg-gray-50"
            )}
        >
            {assignments.length > 0 ? (
                <div className="space-y-1">
                    {assignments.map((a: OrganizedAssignment) => (
                        <Card key={a.id} className="p-0">
                            <CardContent
                                className={cn(
                                    "p-2 rounded-md text-sm border cursor-pointer transition relative group space-y-1",
                                    a.type === "patrol"
                                        ? "bg-orange-100 text-orange-900 hover:bg-orange-200"
                                        : "bg-green-100 text-green-900 hover:bg-green-200"
                                )}
                            >
                                <div className="font-medium truncate">
                                    {a.guardName}
                                </div>

                                <div className="text-xs opacity-80 truncate">
                                    {a.orderName}
                                </div>
                                <p className="text-xs">{a.start}-{a.end}</p>

                                <Badge
                                    variant="outline"
                                    style={getStatusStyle(a.status)}
                                >
                                    {getStatusColor(a.status).label}
                                </Badge>
                                <div className="absolute lg:opacity-0 bottom-1 right-1 group-hover:opacity-100">
                                    <EditAssignmentModal id={a.shiftId} assignment={a} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 opacity-0 hover:opacity-100">
                    <CreateAssignmentModal title="Add" />
                </div>
            )}
        </div>
    );
};

export default DayCell;