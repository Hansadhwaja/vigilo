import CustomHeader from "@/components/common/Header/CustomHeader";
import PlanList from "@/components/Plans/PlanList";

const PlansPage = () => {
  return (
    <div className="space-y-4">
      <CustomHeader
        title="Plans & Pricing"
        description="Manage subscription plans and pricing."
      />
      <PlanList />
    </div>
  );
};

export default PlansPage;
