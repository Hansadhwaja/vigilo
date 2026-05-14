"use client";

import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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

import {
    OrderFormValues,
    orderSchema,
} from "@/schemas";
import { services } from "@/constants";
import ImageUpload from "@/components/common/Image/ImageUpload";

interface OrderFormProps {
    onSubmit: (d: OrderFormValues) => Promise<void> | void;
    isLoading: boolean;
    initialData?: OrderFormValues;
    onCancel: () => void;
}

const OrderForm = ({
    onSubmit,
    isLoading,
    initialData,
    onCancel,
}: OrderFormProps) => {

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        mode: "onChange",
        defaultValues: {
            serviceType: "",
            locationAddress: "",
            siteServiceLat: 0,
            siteServiceLng: 0,
            guardsRequired: 1,
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            locationName: "",
            description: "",
            images: []
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid },
    } = form;

    const onFormSubmit = async (
        data: OrderFormValues
    ) => {
        await onSubmit(data);
        reset();
    };

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                startDate: initialData?.startDate ?
                    new Date(initialData.startDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                endDate: initialData?.endDate ?
                    new Date(initialData.endDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
            });
        }
    }, [initialData]);

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-6"
            >
                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    <Controller
                        name="serviceType"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Service Type
                                </FieldLabel>

                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service.value} value={service.value}>
                                                {service.label}
                                            </SelectItem>
                                        ))}
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

                    <Controller
                        name="guardsRequired"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Guards Required
                                </FieldLabel>

                                <Input
                                    type="number"
                                    min="1"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="locationName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Location Name
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    placeholder="e.g., Mumbai Central Office"

                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="locationAddress"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Location Address
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    placeholder="Full address"

                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="siteServiceLat"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Latitude
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="e.g., 19.0596"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="siteServiceLng"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Longitude
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="e.g., 72.8295"
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Start Date
                                </FieldLabel>

                                <Input
                                    type="date"
                                    {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    End Date
                                </FieldLabel>

                                <Input
                                    type="date"
                                    {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    Start Time
                                </FieldLabel>

                                <Input
                                    type="time"
                                    {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="endTime"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>
                                    End Time
                                </FieldLabel>

                                <Input
                                    type="time"
                                    {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="sm:col-span-2">
                                <FieldLabel>
                                    Description
                                </FieldLabel>

                                <Textarea
                                    placeholder="Order description and requirements..."
                                    {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                    />
                                )}
                            </Field>
                        )}
                    />
                    <ImageUpload name="images" label="Images" buttonLabel="Upload Images" />

                </FieldGroup>

                <div className="flex justify-end gap-3">
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
                            <Loader className="w-4 h-4" />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default OrderForm;