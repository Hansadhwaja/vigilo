import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Car, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VehicleFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import VehicleForm from "../Form/VehicleForm";
import { useEditVehicleMutation } from "@/store/apis/vehiclesApi";
import { VehicleType } from "@/types";

interface Props {
  vehicle: VehicleType;
}

const EditVehicleModal = ({ vehicle }: Props) => {
  const [open, setOpen] = useState(false);

  const [editVehicle, { isLoading }] = useEditVehicleMutation();

  const handleSubmit = async (data: VehicleFormValues) => {
    try {
      await editVehicle({
        id: vehicle.id,
        data,
      }).unwrap();
      toast.success("Vehicle edited successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while editing vehicle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Edit Vehicle
          </DialogTitle>
          <DialogDescription>
            Update the vehicle details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <VehicleForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
          initialData={vehicle}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;
