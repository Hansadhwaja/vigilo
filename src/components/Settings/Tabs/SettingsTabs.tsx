import { Settings, User, Lock, Webhook, CreditCard, Server, Car } from "lucide-react";

import AppTabs from "@/components/common/Tab/AppTabs";
import GeneralTab from "./General/GeneralTab";
import VehiclesTab from "./Vehicles/VehiclesTab";
import UsersTab from "./Users/UsersTab";
import SecurityTab from "./Security/SecurityTab";
import IntegrationsTab from "./Integrations/IntegrationsTab";
import BillingTab from "./Billing/BillingTab";
import SystemTab from "./System/SystemTab";

const SettingsTabs = () => {
    const tabs = [
        {
            value: "general",
            label: "General",
            icon: Settings,
            content: <GeneralTab />,
            activeColor: "data-[state=active]:bg-orange-500",
        },
        {
            value: "vehicles",
            label: "Vehicles",
            icon: Car,
            content: <VehiclesTab />,
            activeColor: "data-[state=active]:bg-emerald-500",
        },
        {
            value: "users",
            label: "Users",
            icon: User,
            content: <UsersTab />,
            activeColor: "data-[state=active]:bg-blue-500",
        },
        {
            value: "security",
            label: "Security",
            icon: Lock,
            content: <SecurityTab />,
            activeColor: "data-[state=active]:bg-red-500",
        },
        {
            value: "integrations",
            label: "Integrations",
            icon: Webhook,
            content: <IntegrationsTab />,
            activeColor: "data-[state=active]:bg-violet-500",
        },
        {
            value: "billing",
            label: "Billing",
            icon: CreditCard,
            content: <BillingTab />,
            activeColor: "data-[state=active]:bg-amber-500",
        },
        {
            value: "system",
            label: "System",
            icon: Server,
            content: <SystemTab />,
            activeColor: "data-[state=active]:bg-slate-700",
        },
    ];

    return (
        <AppTabs
            defaultValue="general"
            tabs={tabs}
            tabsListClassName="w-full overflow-x-auto no-scrollbar"
        />
    );
}

export default SettingsTabs;