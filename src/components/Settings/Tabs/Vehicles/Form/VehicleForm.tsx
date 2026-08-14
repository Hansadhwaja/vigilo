import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValues, vehicleSchema } from "@/schemas";
import Loader from "@/components/common/Loader";
import { FormField } from "@/components/common/Form/FormField";
import { vehicleStatuses, vehicleTypes } from "@/constants";
import { VehicleType } from "@/types";

interface VehicleFormProps {
  initialData?: VehicleType;
  onSubmit: (values: VehicleFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const VehicleForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: VehicleFormProps) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      plateNumber: initialData?.plateNumber ?? "",
      type: initialData?.type ?? "",
      status: initialData?.status ?? "active",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onFormSubmit = (data: VehicleFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="name"
          label="Vehicle Name"
          render={(field) => (
            <Input {...field} placeholder="Enter vehicle name" />
          )}
        />

        <FormField
          control={control}
          name="plateNumber"
          label="Plate Number"
          render={(field) => (
            <Input {...field} placeholder="Enter plate number" />
          )}
        />

        <FormField
          control={control}
          name="type"
          label="Vehicle Type"
          render={(field) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>

              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FormField
          control={control}
          name="status"
          label="Status"
          render={(field) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                {vehicleStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={!isValid || isLoading}>
          {isLoading ? (
            <Loader />
          ) : initialData ? (
            "Edit Vehicle"
          ) : (
            "Add Vehicle"
          )}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
