import { FileText, ShieldCheck } from "lucide-react";

import AppTabs from "@/components/common/Tab/AppTabs";

import PrivacyPolicyEditor from "./PrivacyPolicy";
import TermsAndConditionsEditor from "./TermsAndConditions";

const CMSTab = () => {
  const tabs = [
    {
      value: "guard",
      label: "Guard",
      icon: ShieldCheck,
      content: (
        <div className="space-y-6">
          <PrivacyPolicyEditor type="guard" />
          <TermsAndConditionsEditor type="guard" />
        </div>
      ),
      activeColor: "data-[state=active]:bg-blue-500",
    },
    {
      value: "client",
      label: "Client",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <PrivacyPolicyEditor type="client" />
          <TermsAndConditionsEditor type="client" />
        </div>
      ),
      activeColor: "data-[state=active]:bg-purple-500",
    },
  ];

  return (
    <AppTabs
      defaultValue="guard"
      tabs={tabs}
      tabsListClassName="w-full"
      className="p-2"
    />
  );
};

export default CMSTab;
