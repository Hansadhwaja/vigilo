import { useState } from "react";
import { toast } from "sonner";

import {
  useDeletePatrolSubSiteMutation,
} from "@/store/apis/patrollingAPI";
import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteSubSiteModal {
  subSiteId: string;
}

const DeleteSubSiteModal = ({ subSiteId }: DeleteSubSiteModal) => {
  const [open, setOpen] = useState(false);
  const [deleteSubSite, { isLoading }] = useDeletePatrolSubSiteMutation();

  const handleDelete = async () => {
    try {
      await deleteSubSite(subSiteId).unwrap();

      toast.success("SubSite deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subSite");
    }
  };

  return (
    <DeleteAlertModal
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title="Delete subSite?"
      description="Are you sure you want to delete this subSite? This action cannot be undone."
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

export default DeleteSubSiteModal;
