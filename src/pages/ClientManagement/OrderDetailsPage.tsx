
import { Badge as BadgeIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/apis/ordersApi";
import CustomHeader from "@/components/common/Header/CustomHeader";
import EditOrderModal from "@/components/ClientManagement/Order/Modal/EditOrderModal";
import ServiceInformationCard from "@/components/ClientManagement/Order/Details/ServiceInformationCard";
import LocationImagesCard from "@/components/ClientManagement/Order/Details/LocationImagesCard";
import ClientInformationCard from "@/components/ClientManagement/Order/Details/ClientInformationCard";
import ScheduleCard from "@/components/ClientManagement/Order/Details/ScheduleCard";
import OrderStatusCard from "@/components/ClientManagement/Order/Details/OrderStatusCard";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";


export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: orderResponse,
    isLoading,
  } = useGetOrderByIdQuery(id || "", {
    skip: !id,
  });

  const order = orderResponse?.data ?? orderResponse ?? null;

  if (isLoading) return <Loader />;

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BadgeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />

          <h3 className="text-xl font-semibold mb-2">
            No order found
          </h3>

          <p className="text-lg text-gray-500">
            Please select an order to view details
          </p>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/clients")}
              className="text-lg px-6 py-2"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">
      <CustomHeader
        previousLink="/clients"
        title="Complete Order Details"
        description="Full order information including location and requirements"
        others={
          <div className="flex justify-end">
            <EditOrderModal order={order} />
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ServiceInformationCard order={order} />
          <LocationImagesCard
            images={order.images || []}
          />

          {order.client && (
            <ClientInformationCard
              client={order.client}
            />
          )}
        </div>

        <div className="space-y-6">
          <ScheduleCard order={order} />
          <OrderStatusCard order={order} />
        </div>
      </div>
    </div>

  );
}