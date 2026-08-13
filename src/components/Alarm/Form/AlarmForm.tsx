import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AlarmFormValues, alarmSchema } from "@/schemas";
import { useGetAllPatrolRunsForAdminQuery } from "@/store/apis/patrollingAPI";
import ReactSelect from "react-select";

interface AlarmFormProps {
  isLoading: boolean;
  onSubmit: (data: AlarmFormValues) => void;
}

const AlarmForm = ({ isLoading, onSubmit }: AlarmFormProps) => {
  const { data: patrolData, isLoading: isPatrolsLoading } =
    useGetAllPatrolRunsForAdminQuery({
      status: "ongoing",
    });
  const patrols = patrolData?.data ?? [];

  const form = useForm<AlarmFormValues>({
    resolver: zodResolver(alarmSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      patrolId: "",
      siteId: "",
      type: "",
      priority: "",
      guardIds: [],
      eta: 0,
      slaTime: 0,
      unitPrice: 0,
      location: "",
      monitoringCompany: "",
      license: "",
      description: "",
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const patrolId = watch("patrolId");

  const selectedPatrol = patrols.find((patrol) => patrol.id === patrolId);
  const patrolSites = selectedPatrol?.sites ?? [];
  const patrolGuards = selectedPatrol?.guards ?? [];

  const onFormSubmit = async (data: AlarmFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* TITLE */}
        <div className="col-span-2">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Alarm Title</FieldLabel>
                <Input {...field} placeholder="Brief alarm description" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="patrolId"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Ongoing Patrol</FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("siteId", "");
                  setValue("guardIds", []);
                }}
                disabled={isPatrolsLoading || patrols.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isPatrolsLoading
                        ? "Loading patrols..."
                        : patrols.length === 0
                          ? "No ongoing patrols"
                          : "Select ongoing patrol"
                    }
                  />
                </SelectTrigger>

                {patrols.length > 0 && (
                  <SelectContent>
                    {patrols.map((patrol: any) => (
                      <SelectItem key={patrol.id} value={patrol.id}>
                        {patrol.locationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="siteId"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Alarm Site</FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("guardIds", []);
                }}
                disabled={!patrolId || patrolSites.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !patrolId
                        ? "Select patrol first"
                        : patrolSites.length === 0
                          ? "No sites available"
                          : "Select site"
                    }
                  />
                </SelectTrigger>

                {patrolSites.length > 0 && (
                  <SelectContent>
                    {patrolSites.map((site: any) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name ?? site.siteName ?? site.locationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
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
              <FieldLabel>Assigned Guards</FieldLabel>

              <ReactSelect
                isMulti
                isDisabled={!patrolId || patrolGuards.length === 0}
                options={patrolGuards.map((guard: any) => ({
                  value: guard.id,
                  label: guard.name,
                }))}
                value={patrolGuards
                  .filter((guard: any) =>
                    (field.value ?? []).includes(guard.id),
                  )
                  .map((guard: any) => ({
                    value: guard.id,
                    label: guard.name,
                  }))}
                onChange={(selected) => {
                  field.onChange(selected.map((option) => option.value));
                }}
                placeholder={
                  !patrolId
                    ? "Select patrol first"
                    : patrolGuards.length === 0
                      ? "No guards available"
                      : "Select guards..."
                }
                noOptionsMessage={() => "No guards available"}
                className="text-sm"
                classNamePrefix="select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "42px",
                    borderRadius: "10px",
                    borderColor: fieldState.invalid
                      ? "#ef4444"
                      : state.isFocused
                        ? "#000"
                        : "#e5e7eb",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: fieldState.invalid ? "#ef4444" : "#d1d5db",
                    },
                  }),
                }}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* TYPE */}
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Alarm Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intrusion">Intrusion</SelectItem>
                  <SelectItem value="fire">Fire Alarm</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                  <SelectItem value="security">Security Breach</SelectItem>
                  <SelectItem value="technical">Technical Fault</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* PRIORITY */}
        <Controller
          name="priority"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* ETA */}
        <Controller
          name="eta"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>ETA (minutes)</FieldLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* SLA */}
        <Controller
          name="slaTime"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>SLA Time</FieldLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* PRICE */}
        <Controller
          name="unitPrice"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Unit Price</FieldLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* LOCATION */}
        <div className="col-span-2">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input {...field} placeholder="Exact location" />
              </Field>
            )}
          />
        </div>

        {/* SECTION */}
        <div className="col-span-2 border-t pt-4 mt-2">
          <h2 className="text-base font-semibold text-gray-600">
            Monitoring Details
          </h2>
        </div>

        {/* MONITORING COMPANY */}
        <Controller
          name="monitoringCompany"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Monitoring Company</FieldLabel>
              <Input placeholder="Enter company" {...field} />
            </Field>
          )}
        />

        {/* LICENSE */}
        <Controller
          name="license"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>License</FieldLabel>
              <Input placeholder="Enter license" {...field} />
            </Field>
          )}
        />

        {/* DESCRIPTION */}
        <div className="col-span-2">
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea placeholder="Enter description" {...field} rows={3} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5"
        >
          {isLoading ? <Loader /> : "Create Alarm"}
        </Button>
      </div>
    </form>
  );
};

export default AlarmForm;
