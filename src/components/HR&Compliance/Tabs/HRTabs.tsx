import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import GuardsTab from "../Guard/GuardsTab";
import ComplianceTab from "../Compliance/ComplianceTab";
import TimeSheetsTab from "../TimeSheet/TimeSheetsTab";
import GuardPaymentsTab from "../GuardPayment/GuardPaymentsTab";
import { useSearchParams } from "react-router-dom";

const HRTabs = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get("tab") || "guards";

    const handleTabChange = (
        value: string
    ) => {

        // clear all params and set only tab
        setSearchParams({
            tab: value,
        });
    };
    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
        >
            <TabsList className="w-full overflow-x-auto">
                <TabsTrigger value="guards">Guards</TabsTrigger>
                <TabsTrigger value="timeSheets">Time Sheets</TabsTrigger>
                <TabsTrigger value="guardPayments">Guard Payment</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="guards">
                <GuardsTab />
            </TabsContent>

            <TabsContent value="timeSheets">
                <TimeSheetsTab />
            </TabsContent>

            <TabsContent value="guardPayments">
                <GuardPaymentsTab />
            </TabsContent>

            <TabsContent value="compliance">
                <ComplianceTab />
            </TabsContent>
        </Tabs>
    );
};

export default HRTabs;