import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import WeeklyCalendar from "../WeeklyCalendar";
import DailyTimeline from "../DailyTimeline";
import { useSchedulingData } from "../hook/useSchedulingData";

interface SchedulingTabsProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const SchedulingTabs = ({ scheduling }: SchedulingTabsProps) => {
    return (
        <Tabs
            defaultValue="weekly"
            className="space-y-4"
        >
            <TabsList className="min-h-14 rounded-full border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-sky-50 p-1.5 shadow-sm">
                <TabsTrigger
                    value="weekly"
                    className="
            min-w-35 rounded-full px-6 py-2.5
            text-sm font-semibold text-slate-600
            transition-all duration-300
            data-[state=active]:bg-orange-500
            data-[state=active]:text-white
            data-[state=active]:shadow-md
          "
                >
                    Weekly
                </TabsTrigger>

                <TabsTrigger
                    value="daily"
                    className="
            min-w-35 rounded-full px-6 py-2.5
            text-sm font-semibold text-slate-600
            transition-all duration-300
            data-[state=active]:bg-sky-500
            data-[state=active]:text-white
            data-[state=active]:shadow-md
          "
                >
                    Daily
                </TabsTrigger>
            </TabsList>

            <TabsContent
                value="weekly"
                className="mt-0"
            >
                <WeeklyCalendar scheduling={scheduling} />
            </TabsContent>

            <TabsContent
                value="daily"
                className="mt-0"
            >
                <DailyTimeline scheduling={scheduling} />
            </TabsContent>
        </Tabs>
    );
};

export default SchedulingTabs;