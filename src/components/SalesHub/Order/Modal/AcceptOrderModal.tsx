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

import {
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import { useAcceptOrderMutation } from "@/apis/ordersApi";

import Loader from "@/components/common/Loader";

const AcceptOrderModal = ({
    id,
}: {
    id: string;
}) => {
    const [open, setOpen] =
        useState(false);

    const [
        acceptOrder,
        { isLoading: isAccepting },
    ] = useAcceptOrderMutation();

    const handleAccept =
        async () => {
            try {
                await acceptOrder(
                    id
                ).unwrap();

                toast.success(
                    "Order accepted successfully"
                );

                setOpen(false);
            } catch (error) {
                toast.error(
                    "Failed to accept order"
                );
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
                    className="
                        w-full justify-start rounded-xl
                        px-3 py-2 text-green-600
                        transition-all
                        hover:bg-green-50
                        hover:text-green-700
                    "
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />

                    Accept Order
                </Button>
            </DialogTrigger>

            <DialogContent
                className="
                    max-w-md overflow-hidden
                    rounded-3xl border-0 p-0
                "
            >
                {/* TOP */}
                <div
                    className="
                        relative overflow-hidden
                        bg-gradient-to-r
                        from-green-500
                        via-emerald-400
                        to-sky-500
                        px-7 py-8 text-white
                    "
                >
                    <div className="absolute inset-0 bg-black/5" />

                    <DialogHeader className="relative items-center text-center">
                        <div
                            className="
                                mb-4 flex h-16 w-16 items-center
                                justify-center rounded-2xl
                                bg-white/15 backdrop-blur
                            "
                        >
                            <ShieldCheck className="h-8 w-8" />
                        </div>

                        <DialogTitle className="text-2xl font-bold">
                            Accept Order
                        </DialogTitle>

                        <DialogDescription className="mt-2 text-white/85">
                            Confirm and activate this
                            order
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* CONTENT */}
                <div className="space-y-6 p-7">
                    <div
                        className="
                            rounded-2xl border border-green-100
                            bg-green-50/50 p-5
                        "
                    >
                        <p className="text-sm leading-7 text-slate-600">
                            Are you sure you want to
                            accept this order and
                            start the assigned
                            security service?
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setOpen(false)
                            }
                            disabled={
                                isAccepting
                            }
                            className="
                                h-11 rounded-2xl
                                border-slate-200 px-5
                            "
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={
                                handleAccept
                            }
                            disabled={
                                isAccepting
                            }
                            className="
                                h-11 rounded-2xl
                                bg-green-600 px-5
                                font-semibold text-white
                                hover:bg-green-700
                            "
                        >
                            {isAccepting ? (
                                <Loader className="h-4 w-4" />
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Accept Order
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AcceptOrderModal;