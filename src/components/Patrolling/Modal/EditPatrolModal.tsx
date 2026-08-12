import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import PatrolForm from "../Form/PatrolForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEditPatrolRunMutation } from "@/store/apis/patrollingAPI";
import { PatrolFormValues } from "@/schemas";
import { toast } from "sonner";
import { AdminPatrolRunDetails } from "@/types/patrolling/patrolling.types";
import { mapPatrolDetailsToFormValues } from "@/utils/patrolling";

interface Props {
  patrolData: AdminPatrolRunDetails;
}

const EditPatrolModal = ({ patrolData }: Props) => {
  const [open, setOpen] = useState(false);
  const [editPatrolRun, { isLoading }] = useEditPatrolRunMutation();

  const handleSubmit = async (data: PatrolFormValues) => {
    try {
      await editPatrolRun({
        id: patrolData.patrol.id,
        data,
      }).unwrap();
      toast.success("Patrol edited Successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Error while editing patrol");
    }
  };

  const initialData: PatrolFormValues =
    mapPatrolDetailsToFormValues(patrolData);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-linear-to-r from-indigo-500 via-violet-600 to-indigo-700">
          <Pencil />
          Edit Patrol
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl max-sm:w-[95vw] max-h-[95vh] p-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patrol Run Details</DialogTitle>
          <DialogDescription>
            Set up comprehensive patrol with sites, sub-sites, and checkpoints
          </DialogDescription>
        </DialogHeader>

        <PatrolForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPatrolModal;
