import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Car, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VehicleFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import VehicleForm from "../Form/VehicleForm";
import { useCreateVehicleMutation } from "@/store/apis/vehiclesApi";

const AddVehicleModal = () => {
  const [open, setOpen] = useState(false);

  const [createVehicle, { isLoading }] = useCreateVehicleMutation();

  const handleSubmit = async (data: VehicleFormValues) => {
    try {
      await createVehicle(data).unwrap();
      toast.success("New Vehicle successfully added");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while adding vehicle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer rounded-full bg-linear-to-r from-green-500 via-green-600 to-green-700">
          <Plus />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Add New Vehicle
          </DialogTitle>
          <DialogDescription>
            Fill in all required fields to add a new vehicle
          </DialogDescription>
        </DialogHeader>
        <VehicleForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
