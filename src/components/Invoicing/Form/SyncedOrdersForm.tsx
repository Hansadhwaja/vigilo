"use client";

import { Order } from "@/apis/ordersApi";
import { RootState } from "@/apis/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { calculateWork, formatDate } from "@/lib/utils";
import { Info, Trash2 } from "lucide-react";
import {
    Controller,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { useSelector } from "react-redux";


const SyncedOrdersForm = ({ orders }: { orders: Order[] }) => {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "services",
    });

    const serviceData = useSelector((s: RootState) => s.servicePricing.data);

    return (
        <Card className="p-0">
            <CardContent className="p-4">
                <CardHeader className="px-0 sub-heading">
                    Synced Orders & Scheduled Days
                </CardHeader>

                <CardDescription className="text-blue-500 flex gap-2 items-center description">
                    <Info size={12} />
                    Auto-synced from Orders & Scheduling Module
                </CardDescription>

                <FieldGroup>
                    <Controller
                        name="orders"
                        control={control}
                        render={({ field }) => (
                            <Field className="py-4 space-y-3">
                                {orders.map((o) => {
                                    const { hours, days } = calculateWork(
                                        o.startDate,
                                        o.startTime,
                                        o.endDate,
                                        o.endTime
                                    );

                                    const isChecked = field.value?.some(
                                        (item: any) => item.id === o.id
                                    );
                                    const service = serviceData[o.serviceType];
                                    const price = service.priceType == "daily" ? service.dailyPrice : service.hourlyPrice;
                                    const duration = service.priceType == "daily" ? `${days} days` : `${hours} hrs`;
                                    const durationValue = service.priceType == "daily" ? days : hours;
                                    return (
                                        <Card key={o.id} className="p-0">
                                            <CardContent className="flex justify-between items-center border bg-blue-50 p-4 rounded-md">
                                                <div className="flex gap-3 items-start">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                const service = serviceData[o.serviceType];
                                                                field.onChange([
                                                                    ...(field.value || []),
                                                                    {
                                                                        id: o.id,
                                                                        title: o.serviceType,
                                                                        startDate: o.startDate,
                                                                        startTime: o.startTime,
                                                                        endDate: o.endDate,
                                                                        endTime: o.endTime,
                                                                        hours,
                                                                        days,
                                                                        dailyPrice: service.dailyPrice,
                                                                        hourlyPrice: service.hourlyPrice,
                                                                        priceType: service.priceType,
                                                                        renewalDate: service.renewalDate
                                                                    },
                                                                ]);
                                                            } else {
                                                                field.onChange(
                                                                    field.value.filter(
                                                                        (item: any) => item.id !== o.id
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />

                                                    <div>
                                                        <div className="flex gap-2 items-center">
                                                            <h3 className="font-semibold">
                                                                {o.id}
                                                            </h3>
                                                            <p className="capitalize">{o.serviceType}</p>
                                                        </div>

                                                        <div className="text-sm text-gray-600">
                                                            <p>
                                                                {formatDate(o.startDate)} {o.startTime} →{" "}
                                                                {formatDate(o.endDate)} {o.endTime}
                                                            </p>
                                                            <p>
                                                                {days} days • {hours} hrs
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <Badge className="capitalize">{o.status}</Badge>
                                                    <p className="text-sm">
                                                        {duration} × ₹{price || 0}
                                                    </p>
                                                    <p className="font-semibold">
                                                        ₹{(durationValue * Number(price)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Separator />

                <div className="py-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="sub-heading">Add Manual Days</h2>
                            <p className="description">
                                Extra or offline work
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    title: "",
                                    days: 0,
                                    price: 0,
                                })
                            }
                        >
                            + Add Service
                        </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                        {fields.map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 gap-2 items-end"
                            >
                                <Controller
                                    control={control}
                                    name={`services.${index}.title`}
                                    render={({ field }) => (
                                        <Field className="col-span-6">
                                            <FieldLabel>Title</FieldLabel>
                                            <Input
                                                {...field}
                                                placeholder="Service Title"
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`services.${index}.days`}
                                    render={({ field }) => (
                                        <Field className="col-span-2">
                                            <FieldLabel>Days</FieldLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`services.${index}.price`}
                                    render={({ field }) => (
                                        <Field className="col-span-3">
                                            <FieldLabel>Price</FieldLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Button
                                    size="icon-sm"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                    className="col-span-1"
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SyncedOrdersForm;