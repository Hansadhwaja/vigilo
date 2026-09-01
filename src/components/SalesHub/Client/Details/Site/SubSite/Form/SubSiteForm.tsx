"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/common/Form/FormField";
import Loader from "@/components/common/Loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup } from "@/components/ui/field";

import { DollarSign, Timer } from "lucide-react";

import {
  SubSiteFormValues,
  subSiteSchema,
} from "@/schemas";

interface SubSiteFormProps {
  isLoading: boolean;
  onSubmit: (
    data: SubSiteFormValues,
  ) => Promise<void> | void;
  onCancel: () => void;
  initialData?: SubSiteFormValues;
}

const SubSiteForm = ({
  isLoading,
  onSubmit,
  onCancel,
  initialData,
}: SubSiteFormProps) => {
  const form = useForm<SubSiteFormValues>({
    resolver: zodResolver(subSiteSchema),
    mode: "onChange",
    defaultValues: initialData || {
      name: "",
      unitPrice: 0,
      estimatedDuration: 0,
      description: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  const onFormSubmit = async (data: SubSiteFormValues) => {
    await onSubmit(data);

    if (!initialData) {
      reset();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-6"
      >
        <FieldGroup className="space-y-5">
          <FormField
            name="name"
            control={control}
            label="Sub-Site Name"
            render={(field) => (
              <Input
                {...field}
                placeholder="e.g., Terminal 1 Main Area"
              />
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="unitPrice"
              control={control}
              label="Unit Price ($)"
              render={(field) => (
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                  <Input
                    type="number"
                    placeholder="150"
                    className="pl-10"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value),
                      )
                    }
                  />
                </div>
              )}
            />

            <FormField
              name="estimatedDuration"
              control={control}
              label="Est. Duration (mins)"
              render={(field) => (
                <div className="relative">
                  <Timer className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                  <Input
                    type="number"
                    placeholder="60"
                    className="pl-10"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value),
                      )
                    }
                  />
                </div>
              )}
            />
          </div>

          <FormField
            name="description"
            control={control}
            label="Description"
            render={(field) => (
              <Textarea
                {...field}
                placeholder="Description of this sub-site area and specific requirements..."
                className="h-28 resize-none overflow-y-auto"
              />
            )}
          />
        </FieldGroup>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="min-w-36"
          >
            {isLoading ? (
              <Loader className="h-4 w-4" />
            ) : initialData ? (
              "Save Changes"
            ) : (
              "Create Sub-Site"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SubSiteForm;