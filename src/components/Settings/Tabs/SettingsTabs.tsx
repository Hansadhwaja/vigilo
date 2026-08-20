import { User, CreditCard, Car, FileText } from "lucide-react";

import AppTabs from "@/components/common/Tab/AppTabs";
import VehiclesTab from "./Vehicles/VehiclesTab";
import UsersTab from "./Users/UsersTab";
import BillingTab from "./Billing/BillingTab";
import CMSTab from "./CMS/CMSTab";

const SettingsTabs = () => {
  const tabs = [
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
      value: "billing",
      label: "Billing",
      icon: CreditCard,
      content: <BillingTab />,
      activeColor: "data-[state=active]:bg-amber-500",
    },
    {
      value: "cms",
      label: "CMS",
      icon: FileText,
      content: <CMSTab />,
      activeColor: "data-[state=active]:bg-orange-500",
    },
  ];

  return (
    <AppTabs
      defaultValue="vehicles"
      tabs={tabs}
      tabsListClassName="w-full no-scrollbar"
      className="p-2"
    />
  );
};

export default SettingsTabs;
