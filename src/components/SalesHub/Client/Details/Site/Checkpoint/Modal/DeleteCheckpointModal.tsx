import { useState } from "react";
import { toast } from "sonner";

import { useDeleteCheckpointMutation } from "@/store/apis/patrollingAPI";
import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteCheckpointModalProps {
  checkpointId: string;
}

const DeleteCheckpointModal = ({
  checkpointId,
}: DeleteCheckpointModalProps) => {
  const [open, setOpen] = useState(false);
  const [deleteCheckpoint, { isLoading }] = useDeleteCheckpointMutation();

  const handleDelete = async () => {
    try {
      await deleteCheckpoint(checkpointId).unwrap();

      toast.success("Checkpoint deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete checkpoint");
    }
  };

  return (
    <DeleteAlertModal
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title="Delete checkpoint?"
      description="Are you sure you want to delete this checkpoint? This action cannot be undone."
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

export default DeleteCheckpointModal;
