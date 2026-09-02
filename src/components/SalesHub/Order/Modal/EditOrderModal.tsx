import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import OrderForm from "../Form/OrderForm";
import { FilePenLine } from "lucide-react";

import { Order, useEditOrderMutation } from "@/store/apis/ordersApi";

import { OrderFormValues } from "@/schemas";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

interface Props {
  order: Order;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const EditOrderModal = ({ order, open, setOpen }: Props) => {
  const [editOrder, { isLoading }] = useEditOrderMutation();

  const [siteServiceLat, siteServiceLng] = order.siteService.coordinates;

  const initialData = {
    ...order,
    siteServiceLat,
    siteServiceLng,
  };

  const handleSubmit = async (data: OrderFormValues) => {
    try {
      const payload = {
        ...data,

        locationName: data.locationName || "",

        siteService: {
          lat: Number(data.siteServiceLat),

          lng: Number(data.siteServiceLng),
        },

        guardsRequired: Number(data.guardsRequired),
      };

      await editOrder({
        id: order.id,
        data: payload,
      }).unwrap();

      toast.success("Order updated successfully");

      setOpen(false);
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
                    max-h-[92vh] w-full sm:min-w-2xl overflow-hidden
                    rounded-3xl border-0 p-0
                "
      >
        <div
          className="
                        relative overflow-hidden
                        bg-linear-to-r
                        from-orange-500
                        via-orange-400
                        to-sky-500
                        p-4 text-white
                    "
        >
          <div className="absolute inset-0 bg-black/5" />

          <DialogHeader className="relative space-y-3">
            <div className="flex gap-2 items-center w-[90%]">
              <div
                className="
                                flex h-14 w-14 items-center
                                justify-center rounded-2xl
                                bg-white/15 backdrop-blur
                            "
              >
                <FilePenLine className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Edit Order
                </DialogTitle>

                <DialogDescription className="text-white/85">
                  Update order details, schedules, service information, and
                  guard requirements
                </DialogDescription>
              </div>
              <Badge
                className="uppercase text-[10px]"
                style={getStatusStyle(order.status)}
              >
                {getStatusColor(order.status).label}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div
          className="
                        max-h-[72vh] overflow-y-auto
                        bg-slate-50/40 p-4
                    "
        >
          <OrderForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={initialData}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
