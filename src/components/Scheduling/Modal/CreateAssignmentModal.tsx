"use client";

import { useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

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

import AssignmentForm from "../Form/AssignmentForm";

interface CreateAssignmentModalProps {
    title?: string;
}

const CreateAssignmentModal = ({
    title,
}: CreateAssignmentModalProps) => {
    const [open, setOpen] =
        useState(false);

    const [
        createSchedule,
        { isLoading },
    ] = useCreateScheduleMutation();

    const handleSubmit = async (
        data: any
    ) => {
        try {
            const payload = {
                description:
                    data.description,

                date: data.startDate,

                endDate: data.endDate,

                orderId: data.orderId,

                guardIds: data.guardIds,

                startTime:
                    data.startTime,

                endTime:
                    data.endTime,
            };

            await createSchedule(
                payload
            ).unwrap();

            toast.success(
                "Assignment created successfully"
            );

            setOpen(false);
        } catch (err: any) {
            toast.error(
                err?.data?.message ||
                "Failed to create assignment"
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
                    variant={
                        title
                            ? "ghost"
                            : "default"
                    }
                    className={
                        title
                            ? "rounded-xl border border-dashed border-slate-300 bg-white font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                            : "rounded-xl bg-slate-900 px-5 font-medium text-white shadow-sm hover:bg-slate-800"
                    }
                >
                    <Plus className="size-4" />

                    {title
                        ? title
                        : "Create Assignment"}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 p-0 shadow-xl sm:max-w-3xl">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 bg-slate-50 px-6 py-5 text-left">
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                        Create Assignment
                    </DialogTitle>

                    <DialogDescription className="mt-1 text-sm text-slate-500">
                        Assign guards to a
                        schedule and manage
                        shift timings.
                    </DialogDescription>
                </DialogHeader>

                {/* Form */}
                <div className="p-6">
                    <AssignmentForm
                        isLoading={
                            isLoading
                        }
                        onSubmit={
                            handleSubmit
                        }
                        onCancel={() =>
                            setOpen(false)
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAssignmentModal;