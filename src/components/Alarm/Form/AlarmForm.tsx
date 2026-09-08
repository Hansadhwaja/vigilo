"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactSelect from "react-select";

import Loader from "@/components/common/Loader";
import { FormField } from "@/components/common/Form/FormField";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
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

interface AlarmFormProps {
  isLoading: boolean;
  onSubmit: (data: AlarmFormValues) => void;
  onCancel: () => void;
}

const AlarmForm = ({ isLoading, onSubmit, onCancel }: AlarmFormProps) => {
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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = form;

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
      <FieldGroup className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* TITLE */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="title"
            label="Alarm Title"
            render={(field) => (
              <Input {...field} placeholder="Enter alarm title" />
            )}
          />
        </div>

        {/* ONGOING PATROL */}
        <FormField
          control={control}
          name="patrolId"
          label="Ongoing Patrol"
          render={(field) => (
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
                  {patrols.map((patrol) => (
                    <SelectItem key={patrol.id} value={patrol.id}>
                      {patrol.locationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          )}
        />

        {/* ALARM SITE */}
        <FormField
          control={control}
          name="siteId"
          label="Alarm Site"
          render={(field) => (
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
                  {patrolSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          )}
        />

        {/* ASSIGNED GUARDS */}
        <FormField
          control={control}
          name="guardIds"
          label="Assigned Guards"
          render={(field) => (
            <ReactSelect
              isMulti
              isDisabled={!patrolId || patrolGuards.length === 0}
              options={patrolGuards.map((guard) => ({
                value: guard.id,
                label: guard.name,
              }))}
              value={patrolGuards
                .filter((guard) => (field.value ?? []).includes(guard.id))
                .map((guard) => ({
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
                  borderColor: state.isFocused ? "#000" : "#e5e7eb",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                }),
              }}
            />
          )}
        />

        {/* ALARM TYPE */}
        <FormField
          control={control}
          name="type"
          label="Alarm Type"
          render={(field) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
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
          )}
        />

        {/* PRIORITY */}
        <FormField
          control={control}
          name="priority"
          label="Priority"
          render={(field) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="high">High</SelectItem>

                <SelectItem value="medium">Medium</SelectItem>

                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* ETA */}
        <FormField
          control={control}
          name="eta"
          label="ETA (minutes)"
          render={(field) => (
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {/* SLA */}
        <FormField
          control={control}
          name="slaTime"
          label="SLA Time"
          render={(field) => (
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {/* UNIT PRICE */}
        <FormField
          control={control}
          name="unitPrice"
          label="Unit Price"
          render={(field) => (
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        {/* LOCATION */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="location"
            label="Location"
            render={(field) => (
              <Input {...field} placeholder="Exact location" />
            )}
          />
        </div>

        {/* MONITORING DETAILS */}
        <div className="col-span-2 mt-2 border-t pt-4">
          <h2 className="text-base font-semibold text-gray-600">
            Monitoring Details
          </h2>
        </div>

        {/* MONITORING COMPANY */}
        <FormField
          control={control}
          name="monitoringCompany"
          label="Monitoring Company"
          render={(field) => <Input {...field} placeholder="Enter company" />}
        />

        {/* LICENSE */}
        <FormField
          control={control}
          name="license"
          label="License"
          render={(field) => <Input {...field} placeholder="Enter license" />}
        />

        {/* DESCRIPTION */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="description"
            label="Description"
            render={(field) => (
              <Textarea {...field} placeholder="Enter description" rows={3} />
            )}
          />
        </div>
      </FieldGroup>

      {/* ACTIONS */}
      <div className="mt-4 flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex items-center gap-2 px-5"
        >
          {isLoading ? <Loader /> : "Create Alarm"}
        </Button>
      </div>
    </form>
  );
};

export default AlarmForm;
