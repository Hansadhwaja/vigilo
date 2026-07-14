import {
    Controller,
    Control,
    FieldValues,
    Path,
    ControllerRenderProps,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    render: (
        field: ControllerRenderProps<T, Path<T>>
    ) => React.ReactNode;
}

export function FormField<T extends FieldValues>({
    control,
    name,
    label,
    render,
}: FormFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel>{label}</FieldLabel>

                    {render(field)}

                    {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}