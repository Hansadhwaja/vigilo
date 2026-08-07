import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";
import IconInput from "@/components/common/Input/IconInput";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, Wifi } from "lucide-react";

import { checkpointSchema, CheckpointFormValues } from "@/schemas";

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
          {/* Checkpoint Name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Checkpoint Name</FieldLabel>

                <IconInput
                  Icon={MapPin}
                  placeholder="e.g., Main Gate Security Point"
                  value={field.value}
                  onChange={field.onChange}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Coordinates */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="checkpointLat"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>GPS Latitude</FieldLabel>

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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="checkpointLng"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>GPS Longitude</FieldLabel>

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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Range + Priority */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="range"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Verification Range (meters)</FieldLabel>

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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Priority Level</FieldLabel>

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

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Description */}
          <Controller
            name="checkpointDescription"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>

                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Specific instructions or details for this checkpoint..."
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Actions */}
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
