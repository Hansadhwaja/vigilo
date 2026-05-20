import { useSearchParams } from "react-router-dom";
import AppTabs from "@/components/common/Tab/AppTabs";
import GuardsTab from "../Guard/GuardsTab";
import ComplianceTab from "../Compliance/ComplianceTab";
import TimeSheetsTab from "../TimeSheet/TimeSheetsTab";
import GuardPaymentsTab from "../GuardPayment/GuardPaymentsTab";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const HRTabs = () => {
    const { getParam, setParam } = useQueryParams();

    const activeTab = getParam("tab", "guards");

    const handleTabChange = (value: string) => {
        setParam("tab", value);
    };

    const tabs = [
        {
            value: "guards",
            label: "Guards",
            content: <GuardsTab />,
            activeColor: "data-[state=active]:bg-orange-500",
        },
        {
            value: "timeSheets",
            label: "Time Sheets",
            content: <TimeSheetsTab />,
            activeColor: "data-[state=active]:bg-sky-500",
        },
        {
            value: "guardPayments",
            label: "Guard Payment",
            content: <GuardPaymentsTab />,
            activeColor: "data-[state=active]:bg-emerald-500",
        },
        {
            value: "compliance",
            label: "Compliance",
            content: <ComplianceTab />,
            activeColor: "data-[state=active]:bg-violet-500",
        },
    ];

    return (
        <AppTabs
            value={activeTab}
            onValueChange={handleTabChange}
            tabs={tabs}
            tabsListClassName="w-full overflow-x-auto"
        />
    );
};

export default HRTabs;