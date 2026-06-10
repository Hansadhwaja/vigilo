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
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

const EditAssignmentModal = ({ assignment, id }: { assignment: OrganizedAssignment, id: string }) => {
  const [open, setOpen] = useState(false);
  const [editSchedule, { isLoading }] = useEditScheduleMutation();

  const initialFormData = useMemo(() => {
    return mapAssignmentToForm(assignment);
  }, [assignment]);

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

      toast.success("Assignment edited successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to edited assignment");
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
        <div className="flex gap-4 items-center">
          <DialogHeader>
            <DialogTitle>Edit Guard Assignment</DialogTitle>
            <DialogDescription>Editing shift with
              1 guard(s)
              assigned. You can add or remove guards from this shift.</DialogDescription>
          </DialogHeader>
          <Badge
            variant="outline"
            className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase"
            style={getStatusStyle(assignment.status)}
          >
            {getStatusColor(assignment.status).label}
          </Badge>
        </div>
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