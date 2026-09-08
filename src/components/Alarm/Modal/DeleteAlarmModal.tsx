import { useState } from "react";
import { toast } from "sonner";
import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteAlarmMutation } from "@/store/apis/alarmsAPI";

interface Props {
  alarmId: string;
}

const DeleteAlarmModal = ({ alarmId }: Props) => {
  const [open, setOpen] = useState(false);
  const [deleteAlarm, { isLoading }] = useDeleteAlarmMutation();

  const handleDelete = async () => {
    try {
      await deleteAlarm(alarmId).unwrap();

      toast.success("Alarm deleted successfully");
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
      title="Delete alarm?"
      description="Are you sure you want to delete this alarm? This action cannot be undone."
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

export default DeleteAlarmModal;
