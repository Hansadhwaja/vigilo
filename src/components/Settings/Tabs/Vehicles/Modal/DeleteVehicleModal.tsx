import DeleteAlertModal from "@/components/common/Alert/DeleteAlertModal";
import { Button } from "@/components/ui/button";
import { useDeleteVehicleMutation } from "@/store/apis/vehiclesApi";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  id: string;
}

const DeleteVehicleModal = ({ id }: Props) => {
  const [open, setOpen] = useState(false);

  const [deleteVehicle, { isLoading }] = useDeleteVehicleMutation();

  const handleSubmit = async () => {
    try {
      await deleteVehicle(id).unwrap();
      toast.success("Vehicle deleted successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting vehicle");
    }
  };

  return (
    <DeleteAlertModal
      onOpenChange={setOpen}
      open={open}
      onConfirm={handleSubmit}
      trigger={
        <Button size="icon" variant="outline">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      }
      isLoading={isLoading}
    />
  );
};

export default DeleteVehicleModal;
