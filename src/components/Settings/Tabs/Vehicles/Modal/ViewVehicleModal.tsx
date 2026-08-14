import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Car, Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useGetVehicleByIdQuery } from "@/store/apis/vehiclesApi";

interface Props {
  id: string;
}

const ViewVehicleModal = ({ id }: Props) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetVehicleByIdQuery(id);
  const vehicle = data?.data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Details
          </DialogTitle>

          <DialogDescription>
            View the details of this vehicle.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading vehicle details...
          </div>
        ) : vehicle ? (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Name</p>
              <p className="font-medium">{vehicle.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Plate Number</p>
              <p className="font-medium">{vehicle.plateNumber}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{vehicle.type}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{vehicle.status}</p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Vehicle not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleModal;
