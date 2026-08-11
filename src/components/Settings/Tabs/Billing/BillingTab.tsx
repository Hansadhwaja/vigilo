import PlanDetailsCard from "./PlanDetailsCard";
import TransactionSection from "./Transactions";

const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Billing & Subscription</h2>

        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <PlanDetailsCard />
      <TransactionSection />
    </div>
  );
};

export default BillingTab;
