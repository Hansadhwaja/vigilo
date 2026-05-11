
import { User, Shield, AlertCircle } from "lucide-react";
import CustomHeader from "@/components/common/Header/CustomHeader";
import StatCards from "@/components/common/StatCard/StatCards";
import HRTabs from "@/components/HR&Compliance/Tabs/HRTabs";
import AddGuardModal from "@/components/HR&Compliance/Guard/Modal/AddGuardModal";

export default function HRPage() {

  const stats = [
    {
      label: "Total",
      value: 12,
      Icon: User,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Guards",
      value: 3,
      Icon: Shield,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Issues",
      value: 4,
      Icon: AlertCircle,
      color: "bg-purple-100 text-purple-700",
    }
  ];

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">
      <CustomHeader
        title="HR & Compliance"
        description="Manage guards, assignments & compliance"
        others={
          <AddGuardModal />
        }
      />

      <StatCards items={stats} />
      <HRTabs />
    </div>
  );
}


