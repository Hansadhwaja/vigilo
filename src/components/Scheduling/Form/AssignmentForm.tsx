"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import Loader from "@/components/common/Loader";

import { AssignmentFormValues, assignmentSchema } from "@/schemas";

import { useGetAllOrdersQuery } from "@/apis/ordersApi";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

interface Props {
    isLoading: boolean;
    onSubmit: (data: AssignmentFormValues) => void;
    onCancel?: () => void;
    initialData?: AssignmentFormValues;
}

const AssignmentForm = ({ isLoading, onSubmit, onCancel, initialData }: Props) => {
    const { data: ordersRes } = useGetAllOrdersQuery({});
    const { data: guardsRes } = useGetAllGuardsQuery({ page: 1, limit: 100 });

    const orders = ordersRes?.data || [];
    const guards = guardsRes?.data || [];

    const activeOrders = useMemo(() => {
        return orders.filter(
            (o: any) =>
                !["completed", "cancelled"].includes(
                    (o.status || "").toLowerCase()
                )
        );
    }, [orders]);

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

    const isEdit = !!initialData;

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field className="col-span-2">
                            <FieldLabel>Description</FieldLabel>
                            <Textarea {...field} placeholder="Describe the assignment details..." />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Start Date</FieldLabel>
                            <Input type="date" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>End Date</FieldLabel>
                            <Input type="date" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="orderId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Order</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger disabled={isEdit}>
                                    <SelectValue placeholder="Select order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeOrders.map((o: any) => (
                                        <SelectItem key={o.id} value={o.id} >
                                            <p className="uppercase">{o.locationName}</p>

                                            <Badge
                                                className="rounded-full border px-3 py-1 text-xs font-semibold shadow-sm"
                                                style={getStatusStyle(o.status)}
                                            >
                                                {getStatusColor(o.status).label}
                                            </Badge>
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
                    name="guardIds"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field className="col-span-2">
                            <FieldLabel>Guards</FieldLabel>

                            <div className="border rounded p-2 max-h-40 overflow-y-auto">
                                {guards.map((g: any) => {
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
                                                            field.value.filter((id: string) => id !== g.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <span>{g.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="startTime"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Start Time</FieldLabel>
                            <Input type="time" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="endTime"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>End Time</FieldLabel>
                            <Input type="time" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader /> : initialData ? "Edit Assignment" : "Create Assignment"}
                </Button>
            </div>
        </form>
    );
};

export default AssignmentForm;