import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
} from "lucide-react";
import CreateAssignmentModal from "./Modal/CreateAssignmentModal";
import { OrganizedAssignment } from "@/types";
import AssignmentCard from "./AssignmentCard";
import Stat from "./Stat";

interface DailyTimelineProps {
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
    assignments: OrganizedAssignment[];
}

const DailyTimeline = ({
    selectedDate,
    setSelectedDate,
    assignments,
}: DailyTimelineProps) => {

    const grouped = useMemo(() => {
        return Object.entries(
            assignments.reduce((acc: Record<string, OrganizedAssignment[]>, a) => {
                const key = a.start; // ✅ FIXED
                if (!acc[key]) acc[key] = [];
                acc[key].push(a);
                return acc;
            }, {})
        ).sort(([a], [b]) => a.localeCompare(b));
    }, [assignments]);

    return (
        <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3 px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900">
                                Daily Schedule Timeline
                            </CardTitle>
                            <p className="text-gray-600 text-sm">
                                {selectedDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => {
                                    const d = new Date(selectedDate);
                                    d.setDate(d.getDate() - 1);
                                    setSelectedDate(d);
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const today = new Date();
                                    setSelectedDate(today);
                                }}
                            >
                                Today
                            </Button>

                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => {
                                    const d = new Date(selectedDate);
                                    d.setDate(d.getDate() + 1);
                                    setSelectedDate(d);
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 space-y-4">
                    <div className="flex flex-wrap gap-4 p-4 rounded-lg border bg-blue-50">
                        <Stat label="Total" value={assignments.length} icon={<User />} />
                        <Stat
                            label="Patrol"
                            value={assignments.filter((a) => a.type === "patrol").length}
                        />
                        <Stat
                            label="Static"
                            value={assignments.filter((a) => a.type === "static").length}
                        />
                        <Stat
                            label="Orders"
                            value={new Set(assignments.map((a) => a.orderId)).size}
                            icon={<CalendarIcon />}
                        />
                    </div>

                    {assignments.length === 0 ? (
                        <div className="flex justify-center items-center flex-col text-center py-12 border-2 border-dashed rounded-lg">
                            <CalendarIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 mb-3">No shifts scheduled</p>
                            <CreateAssignmentModal />
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {grouped.map(([time, shifts]) => (
                                <div key={time} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="font-semibold text-gray-700">
                                            {time}
                                        </span>
                                        <div className="flex-1 h-px bg-gray-300" />
                                        <span className="text-xs text-gray-500">
                                            {shifts.length} shift
                                            {shifts.length > 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {shifts.map((a) => (
                                            <AssignmentCard key={a.id} assignment={a} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyTimeline;










