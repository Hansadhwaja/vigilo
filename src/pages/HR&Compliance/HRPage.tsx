
import { User, Shield, AlertCircle } from "lucide-react";
import CustomHeader from "@/components/common/Header/CustomHeader";
import StatCards from "@/components/common/StatCard/StatCards";
import HRTabs from "@/components/HR&Compliance/Tabs/HRTabs";
import AddGuardModal from "@/components/HR&Compliance/Guard/Modal/AddGuardModal";

export default function HRPage() {

  

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      <CustomHeader
        title="HR & Compliance"
        description="Manage guards, assignments & compliance"
        others={
          <AddGuardModal />
        }
      />
      <HRTabs />
    </div>
  );
}


