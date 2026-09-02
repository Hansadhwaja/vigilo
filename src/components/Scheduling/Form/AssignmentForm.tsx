"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";

import { AssignmentFormValues, assignmentSchema } from "@/schemas";

import { useGetAllOrdersQuery } from "@/store/apis/ordersApi";
import { useGetAllGuardsQuery } from "@/store/apis/guardsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { FormField } from "@/components/common/Form/FormField";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  isLoading: boolean;
  onSubmit: (data: AssignmentFormValues) => void;
  onCancel?: () => void;
  initialData?: AssignmentFormValues;
}

const AssignmentForm = ({
  isLoading,
  onSubmit,
  onCancel,
  initialData,
}: Props) => {
  const { data: ordersRes } = useGetAllOrdersQuery({
    status: "active",
  });
  const { data: guardsRes } = useGetAllGuardsQuery({ page: 1, limit: 100 });

  const orders = ordersRes?.data || [];
  const guards = guardsRes?.data || [];

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      description: "",
      startDate: "",
      endDate: "",
      orderId: "",
      guardIds: [],
      startTime: "",
      endTime: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!initialData) return;

    reset({
      description: initialData.description || "",
      startDate: initialData.startDate || "",
      endDate: initialData.endDate || "",
      orderId: initialData.orderId || "",
      guardIds: initialData.guardIds || [],
      startTime: initialData.startTime || "",
      endTime: initialData.endTime || "",
    });
  }, [initialData, reset]);

  const submitHandler = async (data: AssignmentFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Description */}
      <FormField
        control={control}
        name="description"
        label="Description"
        render={(field) => (
          <Textarea
            {...field}
            className="max-h-28 overflow-y-auto"
            placeholder="Describe the assignment details..."
          />
        )}
      />

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <FormField
          control={control}
          name="startDate"
          label="Start Date"
          render={(field) => <Input type="date" {...field} />}
        />

        <FormField
          control={control}
          name="endDate"
          label="End Date"
          render={(field) => <Input type="date" {...field} />}
        />
      </div>

      {/* Order */}
      <div className="mt-4 w-full">
        <FormField
          control={control}
          name="orderId"
          label="Order (Location Name)"
          render={(field) => (
            <Select
              disabled={orders.length === 0}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    orders.length === 0 ? "No orders found" : "Select order"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {orders.map((o: any) => (
                  <SelectItem key={o.id} value={o.id}>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="uppercase truncate max-w-40 cursor-default">
                            {o.locationName}
                          </p>
                        </TooltipTrigger>

                        <TooltipContent>{o.locationName}</TooltipContent>
                      </Tooltip>

                      <Badge
                        className="rounded-full border px-3 py-1 text-[10px] uppercase font-semibold shadow-sm"
                        style={getStatusStyle(o.status)}
                      >
                        {getStatusColor(o.status).label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Guards */}
      <div className="mt-4">
        <FormField
          control={control}
          name="guardIds"
          label="Guards"
          render={(field) => (
            <div className="border rounded p-2 max-h-40 overflow-y-auto">
              {guards.length === 0 ? (
                <p>No Guards found</p>
              ) : (
                guards.map((g: any) => {
                  const selected = field.value?.includes(g.id);

                  return (
                    <div
                      key={g.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), g.id]);
                          } else {
                            field.onChange(
                              (field.value || []).filter(
                                (id: string) => id !== g.id,
                              ),
                            );
                          }
                        }}
                      />

                      <span>{g.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        />
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <FormField
          control={control}
          name="startTime"
          label="Start Time"
          render={(field) => <Input type="time" {...field} />}
        />

        <FormField
          control={control}
          name="endTime"
          label="End Time"
          render={(field) => <Input type="time" {...field} />}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 py-6 border-t mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader />
          ) : initialData ? (
            "Edit Assignment"
          ) : (
            "Create Assignment"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;
