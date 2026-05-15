import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Field,
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

import {
    checkpointSchema,
    CheckpointFormValues,
} from "@/schemas";

interface CheckpointFormProps {
    isLoading: boolean;
    onSubmit: (
        data: CheckpointFormValues
    ) => Promise<void> | void;
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

    const onFormSubmit = async (
        data: CheckpointFormValues
    ) => {
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

                    {/* Checkpoint Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Checkpoint Name
                                </FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="e.g., Main Gate Security Point"
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Controller
                            name="checkpointLat"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        GPS Latitude
                                    </FieldLabel>

                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                                        <Input
                                            type="number"
                                            step="0.000001"
                                            placeholder="-37.8136"
                                            className="pl-10"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="checkpointLng"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        GPS Longitude
                                    </FieldLabel>

                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                                        <Input
                                            type="number"
                                            step="0.000001"
                                            placeholder="144.9631"
                                            className="pl-10"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                    </div>

                    {/* Range + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Controller
                            name="range"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        Verification Range (meters)
                                    </FieldLabel>

                                    <div className="relative">
                                        <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                                        <Input
                                            type="number"
                                            placeholder="20"
                                            className="pl-10"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        GPS tolerance for QR scan verification
                                    </p>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="priority"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        Priority Level
                                    </FieldLabel>

                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="high">
                                                High Priority
                                            </SelectItem>

                                            <SelectItem value="medium">
                                                Medium Priority
                                            </SelectItem>

                                            <SelectItem value="low">
                                                Low Priority
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                <FieldLabel>
                                    Description
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Specific instructions or details for this checkpoint..."
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                </FieldGroup>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? (
                            <Loader className="h-4 w-4" />
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