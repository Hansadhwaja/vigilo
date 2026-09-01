"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { siteSchema, SiteFormValues } from "@/schemas";
import { FormField } from "@/components/common/Form/FormField";

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
        <FormField
          name="name"
          control={control}
          label="Site Name"
          render={(field) => (
            <Input {...field} placeholder="e.g., Airport Terminal Complex" />
          )}
        />

        <FormField
          name="address"
          control={control}
          label="Address"
          render={(field) => (
            <Textarea
              {...field}
              placeholder="Full address of the site..."
              className="h-28 resize-none overflow-y-auto"
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="coordinates.lat"
            control={control}
            label="Latitude"
            render={(field) => (
              <Input
                {...field}
                type="number"
                step="any"
                placeholder="-37.8136"
              />
            )}
          />

          <FormField
            name="coordinates.lng"
            control={control}
            label="Longitude"
            render={(field) => (
              <Input
                {...field}
                type="number"
                step="any"
                placeholder="144.9631"
              />
            )}
          />
        </div>

        <FormField
          name="description"
          control={control}
          label="Description"
          required={false}
          render={(field) => (
            <Textarea
              {...field}
              placeholder="Description of the site and security requirements..."
              className="h-28 resize-none overflow-y-auto"
            />
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
