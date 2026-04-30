"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
    InvoiceFormValues,
    ServicePricingFormValues,
    servicePricingSchema,
} from "@/schemas";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/apis/store";
import { setServicePricing } from "@/apis/slices/servicePricingSlice";

const services = [
    "static",
    "patrol",
    "premiumSecurity",
    "standardPatrol",
    "24/7Monitoring",
    "healthcareSecurity",
    "industrialSecurity",
];

const ServicePricingForm = ({
    isLoading,
    onSubmit,
}: {
    isLoading: boolean;
    onSubmit: (v: ServicePricingFormValues) => void;
}) => {
    const dispatch = useDispatch();

    const serviceData = useSelector((state: RootState) => state.servicePricing.data);

    const form = useForm<ServicePricingFormValues>({
        resolver: zodResolver(servicePricingSchema),
        mode: "onChange",
        defaultValues: {
            service: "",
            hourlyPrice: "",
            dailyPrice: "",
            priceType: "daily",
            renewalDate: "",
        },
    });

    const { control, handleSubmit, setValue, getValues } = form;

    const onFormSubmit = async (data: ServicePricingFormValues) => {
        await onSubmit(data);
        form.reset();
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Controller
                    name="service"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Service</FieldLabel>
                            <Select
                                value={field.value}
                                onValueChange={(value) => {
                                    const currentValues = getValues();
                                    if (currentValues.service) {
                                        dispatch(setServicePricing(currentValues));
                                    }

                                    field.onChange(value);
                                    const selected = serviceData[value];

                                    if (selected) {
                                        setValue("dailyPrice", selected.dailyPrice ?? 0);
                                        setValue("hourlyPrice", selected.hourlyPrice ?? 0);
                                        setValue("priceType", selected.priceType);
                                        setValue("renewalDate", selected.renewalDate);
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select service" />
                                </SelectTrigger>

                                <SelectContent>
                                    {services.map((service) => (
                                        <SelectItem key={service} value={service}>
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="dailyPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Daily Price</FieldLabel>
                            <Input type="number" {...field} placeholder="Enter Daily Price" />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="hourlyPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Hourly Price</FieldLabel>
                            <Input
                                type="number"
                                {...field}
                                placeholder="Enter Hourly Price"
                            />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="priceType"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Price Type</FieldLabel>

                            <RadioGroup
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                }}
                                className="w-fit"
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="daily" id="daily" />
                                    <Label htmlFor="daily">Daily</Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="hourly" id="hourly" />
                                    <Label htmlFor="hourly">Hourly</Label>
                                </div>
                            </RadioGroup>

                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="renewalDate"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Renewal Date</FieldLabel>
                            <Input type="date" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

            </FieldGroup>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <Button type="button" variant="outline">
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5"
                >
                    {isLoading ? <Loader /> : "Save Price"}
                </Button>
            </div>
        </form>
    );
};

export default ServicePricingForm;