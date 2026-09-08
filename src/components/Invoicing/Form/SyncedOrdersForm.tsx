"use client";

import { Order } from "@/store/apis/ordersApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, getOrderPricing } from "@/lib/utils";
import { Info, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { useAppSelector } from "@/store/hooks";

const SyncedOrdersForm = ({ orders }: { orders: Order[] }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const serviceData = useAppSelector((s) => s.servicePricing.data);

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

        <FieldGroup className="py-2">
          {orders.length > 0 ? (
            <Controller
              name="orders"
              control={control}
              render={({ field }) => (
                <Field className="py-4 space-y-3">
                  {orders.map((o) => {
                    const pricing = getOrderPricing(o, serviceData);

                    if (!pricing) return null;

                    const { hours, days, price, duration, total } = pricing;

                    const selectedOrders = field.value || [];

                    const isChecked = selectedOrders.some(
                      (item: any) => item.id === o.id,
                    );

                    return (
                      <Card key={o.id} className="p-0">
                        <CardContent
                          className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    rounded-md
                    border
                    bg-blue-50
                    p-4
                  "
                        >
                          {/* Left Section */}
                          <div className="flex min-w-0 items-start gap-3">
                            <Checkbox
                              className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        rounded-md
                        border-2
                        border-gray-800
                        bg-white
                        shadow-sm
                        transition-colors
                        data-[state=checked]:border-blue-600
                        data-[state=checked]:bg-blue-600
                        data-[state=checked]:text-white
                      "
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const service = serviceData[o.serviceType];

                                  if (!service) return;

                                  field.onChange([
                                    ...selectedOrders,
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
                                      renewalDate: service.renewalDate,
                                    },
                                  ]);
                                } else {
                                  field.onChange(
                                    selectedOrders.filter(
                                      (item: any) => item.id !== o.id,
                                    ),
                                  );
                                }
                              }}
                            />

                            <div className="min-w-0">
                              {/* Order Header */}
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold uppercase">
                                  #{o.id.slice(0, 6)}
                                </h3>

                                <p className="capitalize">{o.serviceType}</p>
                              </div>

                              {/* Order Dates */}
                              <div className="text-sm text-gray-600">
                                <p>
                                  {formatDate(o.startDate)} {o.startTime}
                                  {" → "}
                                  {formatDate(o.endDate)} {o.endTime}
                                </p>

                                <p>
                                  {days} days • {hours} hrs
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Section */}
                          <div className="shrink-0 text-right">
                            <Badge
                              className="uppercase text-[10px]"
                              style={getStatusStyle(o.status)}
                            >
                              {getStatusColor(o.status).label}
                            </Badge>

                            <p className="text-sm">
                              {duration} × {formatCurrency(Number(price))}
                            </p>

                            <p className="font-semibold">
                              {formatCurrency(total)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Field>
              )}
            />
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No orders found
            </div>
          )}
        </FieldGroup>

        <Separator />

        <div className="py-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="sub-heading">Add Manual Days</h2>
              <p className="description">Extra or offline work</p>
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
            {fields.length > 0 ? (
              fields.map((item, index) => (
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
                        <Input {...field} placeholder="Service Title" />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`services.${index}.days`}
                    render={({ field }) => (
                      <Field className="col-span-2">
                        <FieldLabel>Days</FieldLabel>
                        <Input type="number" {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`services.${index}.price`}
                    render={({ field }) => (
                      <Field className="col-span-3">
                        <FieldLabel>Price</FieldLabel>
                        <Input type="number" min={0} {...field} />
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
              ))
            ) : (
              <div className="text-center">No services added</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncedOrdersForm;
