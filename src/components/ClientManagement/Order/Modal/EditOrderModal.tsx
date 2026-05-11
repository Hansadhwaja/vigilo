
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import OrderForm from "../Form/OrderForm";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Order, useEditOrderMutation } from "@/apis/ordersApi";
import { OrderFormValues } from "@/schemas";
import { toast } from "sonner";


const EditOrderModal = ({ order }: { order: Order }) => {
    const [open, setOpen] = useState(false);
    const [editOrder, { isLoading }] = useEditOrderMutation();

    const [siteServiceLat, siteServiceLng] = order.siteService.coordinates;

    const initialData = {
        ...order,
        siteServiceLat,
        siteServiceLng
    };

    const handleSubmit = async (data: OrderFormValues) => {
        console.log("Order Data", data);
        try {
            const payload = {
                ...data,
                locationName: data.locationName || "",
                siteService: {
                    lat: Number(data.siteServiceLat),
                    lng: Number(data.siteServiceLng),
                },
                guardsRequired: Number(data.guardsRequired)
            }
            await editOrder({
                id: order.id,
                data: payload
            }).unwrap();
            toast.success("Order Edited Successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while editing order")
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                >
                    <Edit />
                    Edit Order
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                    <DialogDescription>
                        Update order details including location, schedule, and requirements
                    </DialogDescription>
                </DialogHeader>

                <OrderForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    initialData={initialData}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditOrderModal