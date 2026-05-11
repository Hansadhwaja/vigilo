import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAcceptOrderMutation } from "@/apis/ordersApi";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";

const AcceptOrderModal = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);

    const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();

    const handleAccept = async () => {
        try {
            await acceptOrder(id).unwrap();
            toast.success("Order Accepted successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while accepting Order");
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
                    variant={"ghost"}
                    className="text-green-600 w-full"
                >
                    Accept
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                    <DialogTitle>
                        Accept Order
                    </DialogTitle>

                    <DialogDescription>
                        Confirm accepting this order and starting the service.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 pt-6">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleAccept}
                        disabled={isAccepting}
                    >
                        {isAccepting ? <Loader className="w-4 h-4" /> : "  Accept Order"}


                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default AcceptOrderModal