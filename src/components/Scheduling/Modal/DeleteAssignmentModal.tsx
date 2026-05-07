"use client";

import { useState } from "react";
import { useDeleteScheduleMutation } from "@/apis/schedulingAPI";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

const DeleteAssignmentModal = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [deleteSchedule, { isLoading }] = useDeleteScheduleMutation();

    const handleDelete = async () => {
        try {
            await deleteSchedule({ id }).unwrap();

            toast.success("Assignment Deleted successfully");
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete assignment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant={"destructive"}>
                    <Trash2 />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Schedule?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <div className="flex gap-2">
                        <Button
                            variant={"secondary"}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isLoading ? <Loader /> : "Delete"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAssignmentModal;