import { useState } from "react";
import { toast } from "sonner";
import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeletePatrolRunMutation } from "@/store/apis/patrollingAPI";

interface Props {
  patrolId: string;
}

const DeletePatrolModal = ({ patrolId }: Props) => {
  const [open, setOpen] = useState(false);
  const [deletePatrolRun, { isLoading }] = useDeletePatrolRunMutation();

  const handleDelete = async () => {
    try {
      await deletePatrolRun(patrolId).unwrap();

      toast.success("Patrol deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete alarm");
    }
  };

  return (
    <DeleteAlertModal
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title="Delete patrol?"
      description="Are you sure you want to delete this patrol? This action cannot be undone."
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
};

export default DeletePatrolModal;
