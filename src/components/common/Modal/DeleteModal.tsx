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
import { Trash2 } from "lucide-react";
import Loader from "../Loader";
import { useState } from "react";

interface DeleteModalProps {
    title?: string;
    description?: string;
    onConfirm: () => void;
    isLoading: boolean;
}

const DeleteModal = ({
    title = "item",
    description = "This action cannot be undone. This will permanently delete the item from the system.",
    onConfirm,
    isLoading
}: DeleteModalProps) => {
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        await onConfirm();
        setOpen(false);
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon-sm"
                    variant="destructive"
                    className="cursor-pointer"
                >
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                        Do you want to delete this {title}?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-left">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>

                        <Button variant="secondary">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        disabled={isLoading}
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        {isLoading ? <Loader /> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;