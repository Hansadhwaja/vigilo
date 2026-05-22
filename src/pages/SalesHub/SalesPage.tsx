import CustomHeader from "@/components/common/Header/CustomHeader";
import ClientOperationsTabs from "@/components/SalesHub/Tabs/ClientOperationsTabs";

export default function SalesPage() {
  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">

      <CustomHeader
        title="Sales Management"
        description="Manage clients, orders, and service contracts"
      />
      <ClientOperationsTabs />
    </div>
  );

}
