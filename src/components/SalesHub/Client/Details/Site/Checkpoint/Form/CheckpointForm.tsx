import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";
import IconInput from "@/components/common/Input/IconInput";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { FieldDescription, FieldGroup } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, Wifi } from "lucide-react";

import { checkpointSchema, CheckpointFormValues } from "@/schemas";
import { FormField } from "@/components/common/Form/FormField";

interface CheckpointFormProps {
  isLoading: boolean;
  onSubmit: (data: CheckpointFormValues) => Promise<void> | void;
  onCancel: () => void;
  initialData?: CheckpointFormValues;
}

const CheckpointForm = ({
  isLoading,
  onCancel,
  onSubmit,
  initialData,
}: CheckpointFormProps) => {
  const form = useForm<CheckpointFormValues>({
    resolver: zodResolver(checkpointSchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      checkpointLat: 0,
      checkpointLng: 0,
      range: 20,
      priority: "high",
      checkpointDescription: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = form;

  const onFormSubmit = async (data: CheckpointFormValues) => {
    await onSubmit(data);

    if (!initialData) {
      reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FieldGroup className="space-y-5">
          <FormField
            name="name"
            control={control}
            label="Checkpoint Name"
            render={(field) => (
              <IconInput
                Icon={MapPin}
                placeholder="e.g., Main Gate Security Point"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="checkpointLat"
              control={control}
              label="GPS Latitude"
              render={(field) => (
                <IconInput
                  Icon={MapPin}
                  type="number"
                  step="0.000001"
                  placeholder="-37.8136"
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(value === "" ? 0 : Number(value))
                  }
                />
              )}
            />

            <FormField
              name="checkpointLng"
              control={control}
              label="GPS Longitude"
              render={(field) => (
                <IconInput
                  Icon={MapPin}
                  type="number"
                  step="0.000001"
                  placeholder="144.9631"
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(value === "" ? 0 : Number(value))
                  }
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="range"
              control={control}
              label="Verification Range (meters)"
              render={(field) => (
                <>
                  <IconInput
                    Icon={Wifi}
                    type="number"
                    min={1}
                    placeholder="20"
                    value={field.value}
                    onChange={(value) =>
                      field.onChange(value === "" ? 0 : Number(value))
                    }
                  />

                  <FieldDescription>
                    GPS tolerance for QR scan verification.
                  </FieldDescription>
                </>
              )}
            />

            <FormField
              name="priority"
              control={control}
              label="Priority Level"
              render={(field) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>

                    <SelectItem value="medium">Medium Priority</SelectItem>

                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <FormField
            name="checkpointDescription"
            control={control}
            label="Description"
            render={(field) => (
              <Textarea
                {...field}
                className="h-28 resize-none overflow-y-auto"
                placeholder="Specific instructions or details for this checkpoint..."
              />
            )}
          />
        </FieldGroup>

        <div className="flex justify-end gap-3 pt-6">
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
              <Loader className="size-4" />
            ) : initialData ? (
              "Save Changes"
            ) : (
              "Create Checkpoint"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CheckpointForm;
