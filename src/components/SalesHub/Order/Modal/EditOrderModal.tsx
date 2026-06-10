import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";

import OrderForm from "../Form/OrderForm";

import { Button } from "@/components/ui/button";

import { Edit, FilePenLine } from "lucide-react";

import { Order, useEditOrderMutation } from "@/apis/ordersApi";

import { OrderFormValues } from "@/schemas";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

const EditOrderModal = ({ order }: { order: Order }) => {
    const [open, setOpen] = useState(false);

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
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="
                        w-full justify-start rounded-xl
                        px-3 py-2 text-slate-700
                        transition-all
                        hover:bg-orange-50
                        hover:text-orange-600
                    "
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Order
                </Button>
            </DialogTrigger>

            <DialogContent
                className="
                    max-h-[92vh] max-w-5xl overflow-hidden
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
                        <div className="flex gap-2 items-center">
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
