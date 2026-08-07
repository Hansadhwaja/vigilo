import { useState } from "react";
import { toast } from "sonner";

import { useDeletePatrolSiteMutation } from "@/store/apis/patrollingAPI";
import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteSiteModalProps {
  siteId: string;
}

const DeleteSiteModal = ({ siteId }: DeleteSiteModalProps) => {
  const [open, setOpen] = useState(false);
  const [deleteSite, { isLoading }] = useDeletePatrolSiteMutation();

  const handleDelete = async () => {
    try {
      await deleteSite(siteId).unwrap();

      toast.success("Site deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete site");
    }
  };

  return (
    <DeleteAlertModal
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title="Delete site?"
      description="Are you sure you want to delete this site? This action cannot be undone."
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

export default DeleteSiteModal;
