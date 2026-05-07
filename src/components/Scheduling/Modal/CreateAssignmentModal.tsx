"use client";

import { useState } from "react";
import { useCreateScheduleMutation } from "@/apis/schedulingAPI";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AssignmentForm from "../Form/AssignmentForm";
import { toast } from "sonner";

const CreateAssignmentModal = ({ title }: { title?: string }) => {
    const [open, setOpen] = useState(false);
    const [createSchedule, { isLoading }] = useCreateScheduleMutation();

    const handleSubmit = async (data: any) => {
        try {
            const payload = {
                description: data.description,
                date: data.startDate,
                endDate: data.endDate,
                orderId: data.orderId,
                guardIds: data.guardIds,
                startTime: data.startTime,
                endTime: data.endTime,
            };

            await createSchedule(payload).unwrap();

            toast.success("Assignment created successfully");
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create assignment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={title ? "ghost" : "default"} className="flex items-center gap-2">
                    <Plus />
                    {title ? title : "Create Assignment"}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Guard Assignment</DialogTitle>
                    <DialogDescription>Assign guards to a shift</DialogDescription>
                </DialogHeader>

                <AssignmentForm
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateAssignmentModal;