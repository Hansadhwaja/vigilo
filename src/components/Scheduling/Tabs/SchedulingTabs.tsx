import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";

import WeeklyCalendar from "../WeeklyCalendar";
import DailyTimeline from "../DailyTimeline";
import { OrganizedAssignment } from "@/types";

interface SchedulingTabsProps {
    weekDays: Date[];
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
    navigateWeek: (v: number) => void;
    getAssignmentsForSlot: (date: Date, time: string) => any[];
    assignments: OrganizedAssignment[];
}

const SchedulingTabs = ({
    weekDays,
    selectedDate,
    setSelectedDate,
    navigateWeek,
    getAssignmentsForSlot,
    assignments
}: SchedulingTabsProps) => {
    return (
        <Tabs defaultValue="weekly">
            <TabsList className="w-[60vw]">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
                <WeeklyCalendar
                    weekDays={weekDays}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    navigateWeek={navigateWeek}
                    getAssignmentsForSlot={getAssignmentsForSlot}
                />
            </TabsContent>

            <TabsContent value="daily">
                <DailyTimeline
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    assignments={assignments}
                />
            </TabsContent>
        </Tabs>
    );
};

export default SchedulingTabs;