import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
    AlertTriangle,
    Trash2,
} from "lucide-react";

import Loader from "../Loader";

import { ReactNode, useState } from "react";

interface DeleteModalProps {
    title?: string;
    description?: string;

    onConfirm: () => Promise<void> | void;

    isLoading: boolean;

    trigger?: ReactNode;
}

const DeleteModal = ({
    title = "item",

    description = "This action cannot be undone. This will permanently delete the item from the system.",

    onConfirm,

    isLoading,

    trigger,
}: DeleteModalProps) => {
    const [open, setOpen] =
        useState(false);

    const handleConfirm =
        async () => {
            await onConfirm();

            setOpen(false);
        };

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="
                            rounded-xl border border-red-200
                            text-red-500 transition-all
                            hover:bg-red-50
                            hover:text-red-600
                        "
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent
                className="
                    max-w-md overflow-hidden
                    rounded-3xl border-0 p-0
                "
            >
                {/* TOP */}
                <div
                    className="
                        relative overflow-hidden
                        bg-linear-to-r
                        from-red-500
                        via-red-400
                        to-orange-400
                        px-7 py-8 text-white
                    "
                >
                    <div className="absolute inset-0 bg-black/5" />

                    <AlertDialogHeader className="relative items-center text-center">
                        <div
                            className="
                                mb-4 flex h-16 w-16 items-center
                                justify-center rounded-2xl
                                bg-white/15 backdrop-blur
                            "
                        >
                            <AlertTriangle className="h-8 w-8" />
                        </div>

                        <AlertDialogTitle className="text-2xl font-bold">
                            Delete {title}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="mt-2 text-white/85">
                            This action cannot be
                            undone
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                {/* CONTENT */}
                <div className="space-y-6 p-7">
                    <div
                        className="
                            rounded-2xl border border-red-100
                            bg-red-50/50 p-5
                        "
                    >
                        <p className="text-sm leading-7 text-slate-600">
                            {description}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <AlertDialogFooter className="flex-row gap-3 sm:justify-end">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                disabled={isLoading}
                                className="
                                    h-11 rounded-2xl
                                    border-slate-200 px-5
                                "
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>

                        <Button
                            disabled={isLoading}
                            variant="destructive"
                            onClick={
                                handleConfirm
                            }
                            className="
                                h-11 rounded-2xl
                                px-5 font-semibold
                            "
                        >
                            {isLoading ? (
                                <Loader className="h-4 w-4" />
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;