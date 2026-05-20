import { useSchedulingData } from "../hook/useSchedulingData";
import WeeklyCalendar from "./Weekly/WeeklyCalendar";
import DailyTimeline from "./Daily/DailyTimeline";
import AppTabs from "@/components/common/Tab/AppTabs";

interface SchedulingTabsProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const SchedulingTabs = ({ scheduling }: SchedulingTabsProps) => {
    const tabs = [
        {
            value: "weekly",
            label: "Weekly",
            activeColor: "data-[state=active]:bg-orange-500",
            content: (
                <WeeklyCalendar scheduling={scheduling} />
            ),
        },
        {
            value: "daily",
            label: "Daily",
            activeColor: "data-[state=active]:bg-sky-500",
            content: (
                <DailyTimeline scheduling={scheduling} />
            ),
        },
    ];

    return (
        <AppTabs
            defaultValue="weekly"
            tabs={tabs}
            tabsListClassName="w-200 overflow-x-auto"
        />
    );
};

export default SchedulingTabs;