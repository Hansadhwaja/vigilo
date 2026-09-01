import {
  Controller,
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
  FieldPathValue,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type FormFieldProps<T extends FieldValues, TName extends Path<T>> = {
  control: Control<T>;
  name: TName;
  label: React.ReactNode;
  required?: boolean;
  render: (field: ControllerRenderProps<T, TName>) => React.ReactNode;
};

export function FormField<T extends FieldValues, TName extends Path<T>>({
  control,
  name,
  label,
  required = true,
  render,
}: FormFieldProps<T, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>

          {render(field)}

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
