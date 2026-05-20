import AppTabs from "@/components/common/Tab/AppTabs";

import OrderTabSection from "../Order/OrderTabSection";
import ClientTabSection from "../Client/ClientTabSection";

const ClientOperationsTabs = () => {
    const tabs = [
        {
            value: "order",
            label: "Order",
            activeColor:
                "data-[state=active]:bg-orange-500",
            content: <OrderTabSection />,
        },
        {
            value: "client",
            label: "Client",
            activeColor:
                "data-[state=active]:bg-sky-500",
            content: <ClientTabSection />,
        },
    ]
    return (
        <AppTabs
            defaultValue="order"
            tabs={tabs}
        />
    );
};

export default ClientOperationsTabs;