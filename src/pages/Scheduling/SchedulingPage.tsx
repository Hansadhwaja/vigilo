import CustomHeader from "@/components/common/Header/CustomHeader";
import CreateAssignmentModal from "@/components/Scheduling/Modal/CreateAssignmentModal";
import SchedulingTabs from "@/components/Scheduling/Tabs/SchedulingTabs";
import QuickSummary from "@/components/Scheduling/QuickSummary";
import SchedulingStats from "@/components/Scheduling/SchedulingStats";
import SchedulingSearchFilters from "@/components/Scheduling/SchedulingSearchFilters";
import { useSchedulingData } from "@/components/Scheduling/hook/useSchedulingData";

export default function ShiftPage() {
  const scheduling = useSchedulingData();

  return (
    <section className="space-y-6">
      <CustomHeader
        title="Scheduling Calendar"
        description="Managed Assignment & Calendar View"
        others={
          <div className="flex justify-end">
            <CreateAssignmentModal />
          </div>
        }
      />

      <SchedulingStats scheduling={scheduling} />

      <SchedulingSearchFilters />

      <div className="space-y-6">
        <SchedulingTabs scheduling={scheduling} />
        <QuickSummary scheduling={scheduling} />
      </div>
    </section>
  );
}
