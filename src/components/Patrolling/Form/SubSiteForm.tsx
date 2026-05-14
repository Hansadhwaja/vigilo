"use client";

import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    DollarSign,
    Timer,
} from "lucide-react";

import Loader from "@/components/common/Loader";

import {
    SubSiteFormValues,
    subSiteSchema,
} from "@/schemas";

interface SubSiteFormProps {
    isLoading: boolean;
    onSubmit: (
        data: SubSiteFormValues
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

    const onFormSubmit = async (
        data: SubSiteFormValues
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

                    {/* Subsite Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Sub-Site Name
                                </FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="e.g., Terminal 1 Main Area"
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    {/* Price + Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Controller
                            name="unitPrice"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        Unit Price ($)
                                    </FieldLabel>

                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                                        <Input
                                            type="number"
                                            placeholder="150"
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
                            name="estimatedDuration"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        Est. Duration (mins)
                                    </FieldLabel>

                                    <div className="relative">
                                        <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                                        <Input
                                            type="number"
                                            placeholder="60"
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

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Description
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Description of this sub-site area and specific requirements..."
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