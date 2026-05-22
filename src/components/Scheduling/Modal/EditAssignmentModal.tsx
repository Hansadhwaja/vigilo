"use client";

import { useMemo, useState } from "react";
import { Schedule, useCreateScheduleMutation, useEditScheduleMutation } from "@/apis/schedulingAPI";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import AssignmentForm from "../Form/AssignmentForm";
import { toast } from "sonner";
import { mapAssignmentToForm } from "@/lib/utils";
import { AssignmentFormValues } from "@/schemas";
import { OrganizedAssignment } from "@/types";

const EditAssignmentModal = ({ assignment, id }: { assignment: OrganizedAssignment, id: string }) => {
  const [open, setOpen] = useState(false);
  const [editSchedule, { isLoading }] = useEditScheduleMutation();

  const initialFormData = useMemo(() => {
    return mapAssignmentToForm(assignment);
  }, [assignment]);

  console.log(initialFormData);

  const handleSubmit = async (data: AssignmentFormValues) => {
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

      await editSchedule({ id, data: payload }).unwrap();

      toast.success("Assignment created successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create assignment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="icon-sm">
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Guard Assignment</DialogTitle>
          <DialogDescription>Editing shift with
            1 guard(s)
            assigned. You can add or remove guards from this shift.</DialogDescription>
        </DialogHeader>

        <AssignmentForm
          initialData={initialFormData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentModal;