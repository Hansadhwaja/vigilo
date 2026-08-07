"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { siteSchema, SiteFormValues } from "@/schemas";

interface SiteFormProps {
  initialData?: SiteFormValues;
  onSubmit: (values: SiteFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SiteForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: SiteFormProps) => {
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      description: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: SiteFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Site Name</FieldLabel>

              <Input {...field} placeholder="e.g., Airport Terminal Complex" />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Address</FieldLabel>

              <Textarea
                {...field}
                placeholder="Full address of the site..."
                rows={2}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="coordinates.lat"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Latitude</FieldLabel>

                <Input
                  {...field}
                  type="number"
                  step="any"
                  placeholder="-37.8136"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="coordinates.lng"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Longitude</FieldLabel>

                <Input
                  {...field}
                  type="number"
                  step="any"
                  placeholder="144.9631"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>

              <Textarea
                {...field}
                placeholder="Description of the site and security requirements..."
                rows={3}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={!isValid || isLoading}>
          {isLoading ? <Loader /> : initialData ? "Edit Site" : "Create Site"}
        </Button>
      </div>
    </form>
  );
};

export default SiteForm;
