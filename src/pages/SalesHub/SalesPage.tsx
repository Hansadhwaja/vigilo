import CustomHeader from "@/components/common/Header/CustomHeader";
import AddClientModal from "@/components/SalesHub/Client/Modal/AddClientModal";
import ClientOperationsTabs from "@/components/SalesHub/Tabs/ClientOperationsTabs";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <CustomHeader
        title="Sales Management"
        description="Manage clients, orders, and service contracts"
        others={<AddClientModal />}
      />
      <ClientOperationsTabs />
    </div>
  );
}
