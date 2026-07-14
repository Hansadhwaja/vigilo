import CustomHeader from "@/components/common/Header/CustomHeader";
import ClientOperationsTabs from "@/components/SalesHub/Tabs/ClientOperationsTabs";

export default function SalesPage() {
  return (
    <div className="space-y-6">

      <CustomHeader
        title="Sales Management"
        description="Manage clients, orders, and service contracts"
      />
      <ClientOperationsTabs />
    </div>
  );

}
