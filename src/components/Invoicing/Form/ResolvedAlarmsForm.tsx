"use client";

import { Alarm } from "@/apis/alarmsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";

const ResolvedAlarmsForm = ({ alarms }: { alarms: Alarm[] }) => {
    const { control } = useFormContext();

    return (
        <Card className="p-0">
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardHeader className="px-0 sub-heading">
                            Resolved Alarms
                        </CardHeader>
                        <CardDescription className="description">
                            Available resolved alarms for this client
                        </CardDescription>
                    </div>

                    <Controller
                        name="alarms"
                        control={control}
                        render={({ field }) => (
                            <Button
                                type="button"
                                onClick={() => {
                                    // Select all
                                    field.onChange(
                                        alarms.map((a) => ({
                                            id: a.id,
                                            siteName: a.siteName,
                                            alarmType: a.alarmType,
                                            price: a.price || 150, // fallback
                                        }))
                                    );
                                }}
                            >
                                Select All
                            </Button>
                        )}
                    />
                </div>

                <FieldGroup>
                    <Controller
                        name="alarms"
                        control={control}
                        render={({ field }) => (
                            <Field className="py-4 space-y-3">
                                {alarms.map((a) => {
                                    const isChecked = field.value?.some(
                                        (item: any) => item.id === a.id
                                    );

                                    return (
                                        <Card key={a.id} className="p-0">
                                            <CardContent className="flex justify-between items-center border bg-blue-50 p-4 rounded-md">
                                                {/* LEFT */}
                                                <div className="flex gap-3 items-start">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                field.onChange([
                                                                    ...(field.value || []),
                                                                    {
                                                                        id: a.id,
                                                                        siteName: a.siteName,
                                                                        alarmType: a.alarmType,
                                                                        price: a.price || 150,
                                                                    },
                                                                ]);
                                                            } else {
                                                                field.onChange(
                                                                    field.value.filter(
                                                                        (item: any) => item.id !== a.id
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />

                                                    <div>
                                                        <div className="flex gap-2 items-center">
                                                            <h3 className="font-semibold">{a.id}</h3>
                                                            <p>{a.title}</p>
                                                            <Badge>{a.alarmType}</Badge>
                                                        </div>

                                                        <div className="text-sm text-gray-600">
                                                            <p>{a.siteName}</p>
                                                            <p>{a.createdAt}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₹{a.price || 150}
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
            </CardContent>
        </Card>
    );
};

export default ResolvedAlarmsForm;