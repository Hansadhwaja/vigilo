

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import RejectOrderForm from "../Form/RejectForm";
import { toast } from "sonner";
import { RejectOrderFormValues } from "@/schemas";
import { useCancelOrderMutation } from "@/apis/ordersApi";
import { Button } from "@/components/ui/button";

const RejectOrderModal = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);

    const [cancelOrder, { isLoading }] = useCancelOrderMutation();

    const handleReject = async (data: RejectOrderFormValues) => {
        try {
            await cancelOrder({
                id,
                data,
            }).unwrap();
            toast.success("Order Rejected successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while rejecting Order");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 w-full"
                >
                    Reject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-xl">

                <DialogHeader>
                    <DialogTitle>
                        Reject Order
                    </DialogTitle>

                    <DialogDescription>
                        Provide a reason for rejecting this order.
                    </DialogDescription>
                </DialogHeader>

                <RejectOrderForm
                    onCancel={() => setOpen(false)}
                    onSubmit={handleReject}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
};

export default RejectOrderModal;