"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FieldGroup } from "@/components/ui/field";

import { FormField } from "@/components/common/Form/FormField";

import { ServicePricingFormValues, servicePricingSchema } from "@/schemas";

import { setServicePricing } from "@/store/slices/servicePricingSlice";
import { services } from "@/constants";
import { useAppSelector } from "@/store/hooks";

const ServicePricingForm = ({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: (v: ServicePricingFormValues) => void;
}) => {
  const dispatch = useDispatch();

  const serviceData = useAppSelector((state) => state.servicePricing.data);

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
      <FieldGroup className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Service */}
        <FormField
          control={control}
          name="service"
          label="Service"
          render={(field) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                const currentValues = getValues();

                // Save the previously selected service pricing
                if (currentValues.service) {
                  dispatch(setServicePricing(currentValues));
                }

                field.onChange(value);

                // Load pricing for the newly selected service
                const selected = serviceData[value];

                if (selected) {
                  setValue("dailyPrice", selected.dailyPrice ?? 0, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setValue("hourlyPrice", selected.hourlyPrice ?? 0, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setValue("priceType", selected.priceType, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setValue("renewalDate", selected.renewalDate, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>

              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {/* Daily Price */}
        <FormField
          control={control}
          name="dailyPrice"
          label="Daily Price"
          render={(field) => (
            <Input type="number" {...field} placeholder="Enter Daily Price" />
          )}
        />

        {/* Hourly Price */}
        <FormField
          control={control}
          name="hourlyPrice"
          label="Hourly Price"
          render={(field) => (
            <Input type="number" {...field} placeholder="Enter Hourly Price" />
          )}
        />

        {/* Price Type */}
        <FormField
          control={control}
          name="priceType"
          label="Price Type"
          render={(field) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
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
          )}
        />

        {/* Renewal Date */}
        <FormField
          control={control}
          name="renewalDate"
          label="Renewal Date"
          render={(field) => <Input type="date" {...field} />}
        />
      </FieldGroup>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3 border-t pt-6">
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
