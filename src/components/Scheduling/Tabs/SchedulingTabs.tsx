import { useSchedulingData } from "../hook/useSchedulingData";
import WeeklyCalendar from "./Weekly/WeeklyCalendar";
import DailyTimeline from "./Daily/DailyTimeline";
import AppTabs from "@/components/common/Tab/AppTabs";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

interface SchedulingTabsProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const SchedulingTabs = ({ scheduling }: SchedulingTabsProps) => {
    const { getParam, setParam } = useQueryParams();

    const activeTab = getParam("tab", "weekly");

    const handleTabChange = (value: string) => {
        setParam("tab", value);
    };

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
            value={activeTab}
            onValueChange={handleTabChange}
            tabs={tabs}
            tabsListClassName="w-200 overflow-x-auto"
        />
    );
};

export default SchedulingTabs;