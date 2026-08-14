import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { useGetAllGuardsQuery } from "@/store/apis/guardsApi";
import { useGetAllOrdersQuery } from "@/store/apis/ordersApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllVehiclesQuery } from "@/store/apis/vehiclesApi";
import { VehicleType } from "@/types/vehicle";

const PatrolBasicInfoSection = () => {
  const { control } = useFormContext();

  const { data: guardsResponse } = useGetAllGuardsQuery();

  const guards = guardsResponse?.data ?? [];

  const { data: ordersResponse } = useGetAllOrdersQuery({
    serviceType: "patrol",
    status: "upcoming",
  });

  const orders = ordersResponse?.data ?? [];

  const { data, isLoading } = useGetAllVehiclesQuery({
    status: "active",
  });
  const vehicles = data?.data ?? [];

  return (
    <div className="rounded-2xl border bg-white p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Patrol Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Configure patrol guards, sites, checkpoints and scheduling.
        </p>
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Controller
          name="patrolName"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Patrol Name</FieldLabel>

              <Input {...field} placeholder="Enter Patrol Name" />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="orderId"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Assign Order Name</FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={orders.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      orders.length === 0 ? "No orders found" : "Select order"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">{order.locationName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="guardIds"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Assign Guards</FieldLabel>

              <ReactSelect
                isMulti
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: "#e5e7eb",
                    boxShadow: "none",
                  }),
                }}
                options={guards.map((guard) => ({
                  value: guard.id,
                  label: guard.name,
                }))}
                value={guards
                  .filter((guard) => field.value.includes(guard.id))
                  .map((guard) => ({
                    value: guard.id,
                    label: guard.name,
                  }))}
                onChange={(selected) => {
                  field.onChange(selected.map((item) => item.value));
                }}
                placeholder="Select guards"
                className="text-sm"
                classNamePrefix="select"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="vehicleIds"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Assign Vehicles</FieldLabel>

              <ReactSelect
                isMulti
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: "#e5e7eb",
                    boxShadow: "none",
                  }),
                }}
                options={vehicles.map((v: VehicleType) => ({
                  value: v.id,
                  label: v.name,
                }))}
                value={vehicles
                  .filter((v: VehicleType) => field.value.includes(v.id))
                  .map((v: VehicleType) => ({
                    value: v.id,
                    label: v.name,
                  }))}
                onChange={(selected) => {
                  field.onChange(selected.map((item) => item.value));
                }}
                placeholder="Select vehicles"
                className="text-sm"
                classNamePrefix="select"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="startDateTime"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Start Date & Time</FieldLabel>

              <Input type="datetime-local" {...field} />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="estimatedCompletion"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>End Date & Time</FieldLabel>

              <Input type="datetime-local" {...field} />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="unitPrice"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Unit Price ($ / hour)</FieldLabel>

              <Input
                type="number"
                min="0"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Additional Notes</FieldLabel>

              <Textarea
                placeholder="Additional patrol instructions..."
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
};

export default PatrolBasicInfoSection;
