import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { ShieldX, XCircle } from "lucide-react";

import RejectOrderForm from "../Form/RejectForm";

import { toast } from "sonner";

import { RejectOrderFormValues } from "@/schemas";

import { useCancelOrderMutation } from "@/store/apis/ordersApi";

interface Props {
  id: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const RejectOrderModal = ({ id, open, setOpen }: Props) => {
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const handleReject = async (data: RejectOrderFormValues) => {
    try {
      await cancelOrder({
        id,
        data,
      }).unwrap();

      toast.success("Order rejected successfully");

      setOpen(false);
    } catch (error) {
      toast.error("Failed to reject order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
                    max-w-2xl overflow-hidden
                    rounded-3xl border-0 p-0
                "
      >
        {/* HEADER */}
        <div
          className="
                        relative overflow-hidden
                        bg-linear-to-r
                        from-red-500
                        via-orange-400
                        to-amber-400
                        px-8 py-7 text-white
                    "
        >
          <div className="absolute inset-0 bg-black/5" />

          <DialogHeader className="relative">
            <div className="flex gap-2 items-center">
              <div
                className="
                                flex h-14 w-14 items-center
                                justify-center rounded-2xl
                                bg-white/15 backdrop-blur
                            "
              >
                <ShieldX className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Reject Order
                </DialogTitle>

                <DialogDescription className="text-white/85">
                  Provide a reason for rejecting this security service request
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* FORM */}
        <div className="bg-slate-50/40 p-4">
          <RejectOrderForm
            onCancel={() => setOpen(false)}
            onSubmit={handleReject}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectOrderModal;
