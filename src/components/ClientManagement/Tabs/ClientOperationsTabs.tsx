import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
;
import OrderTabSection from "../Order/OrderTabSection";
import ClientTabSection from "../Client/ClientTabSection";

interface SchedulingTabsProps {

}

const ClientOperationsTabs = ({

}: SchedulingTabsProps) => {
    return (
        <Tabs defaultValue="order">
            <TabsList className="w-[60vw]">
                <TabsTrigger value="order">Order</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
            </TabsList>

            <TabsContent value="order">
                <OrderTabSection />
            </TabsContent>

            <TabsContent value="client">
                <ClientTabSection />
            </TabsContent>
        </Tabs>
    );
};

export default ClientOperationsTabs;