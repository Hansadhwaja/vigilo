import { Badge as BadgeIcon, ClipboardList } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useGetAdminOrderByIdQuery } from "@/apis/ordersApi";
import CustomHeader from "@/components/common/Header/CustomHeader";
import EditOrderModal from "@/components/SalesHub/Order/Modal/EditOrderModal";
import ServiceInformationCard from "@/components/SalesHub/Order/Details/ServiceInformationCard";
import ClientInformationCard from "@/components/SalesHub/Order/Details/ClientInformationCard";
import ScheduleCard from "@/components/SalesHub/Order/Details/ScheduleCard";
import OrderStatusCard from "@/components/SalesHub/Order/Details/OrderStatusCard";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import ImagesCard from "@/components/common/Card/ImagesCard";

export default function OrderDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const { data: orderResponse, isLoading } = useGetAdminOrderByIdQuery(
    id || "",
    {
      skip: !id,
    },
  );

  const order = orderResponse?.data;

  if (isLoading) {
    return (
      <div
        className="
          flex h-[70vh] items-center
          justify-center
        "
      >
        <div
          className="
            flex flex-col items-center gap-4
          "
        >
          <div
            className="
              flex h-16 w-16 items-center
              justify-center rounded-3xl
              bg-linear-to-br
              from-orange-100 to-sky-100
            "
          >
            <Loader />
          </div>

          <div className="space-y-1 text-center">
            <h3 className="font-semibold text-slate-800">Loading Order</h3>

            <p className="text-sm text-slate-500">
              Fetching complete order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="
          flex min-h-[70vh] items-center
          justify-center
        "
      >
        <div
          className="
            w-full max-w-lg rounded-[2rem]
            border border-slate-200
            bg-white p-10 text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto mb-6 flex h-24 w-24
              items-center justify-center
              rounded-[2rem]
              bg-gradient-to-br
              from-orange-100 to-sky-100
            "
          >
            <ClipboardList
              className="
                h-12 w-12 text-slate-500
              "
            />
          </div>

          <h2
            className="
              text-2xl font-bold
              text-slate-900
            "
          >
            No Order Found
          </h2>

          <p
            className="
              mt-3 text-sm leading-7
              text-slate-500
            "
          >
            The order you are trying to access may have been deleted or does not
            exist anymore.
          </p>

          <Button
            variant="outline"
            onClick={() => navigate("/clients")}
            className="
              mt-7 h-11 rounded-2xl
              border-slate-200 px-6
            "
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      <CustomHeader
        previousLink="/sales"
        title="Complete Order Details"
        description="Full order information including schedule, client details, service configuration, and location requirements"
        others={
          <div className="flex justify-end">
            <EditOrderModal order={order} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div
          className="
            space-y-6 lg:col-span-2
          "
        >
          <ServiceInformationCard order={order} />
          <ImagesCard
            title="Location Images"
            description="Location preview and site images"
            emptyDescription="No location images available."
            images={order.images || []}
          />
          {order?.user && <ClientInformationCard client={order?.user} />}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <ScheduleCard order={order} />

          <OrderStatusCard order={order} />
        </div>
      </div>
    </div>
  );
}
