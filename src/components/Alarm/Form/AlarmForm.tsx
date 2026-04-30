import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
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
import { useGetAllPatrolRunsForAdminQuery, useGetAllPatrolSitesQuery } from "@/apis/patrollingAPI";
import { useMemo } from "react";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";

interface AlarmFormProps {
    isLoading: boolean;
    onSubmit: (data: AlarmFormValues) => void;
}

const AlarmForm = ({
    isLoading,
    onSubmit,
}: AlarmFormProps) => {

    const { data: sitesResponse, isLoading: sitesLoading } = useGetAllPatrolSitesQuery({});

    const sites = sitesResponse?.data || [];

    const { data: guardsResponse, isLoading: isGuardLoading, isError, error, isFetching } = useGetAllGuardsQuery({
        limit: 10,
        page: 1,
    });

    const guards = guardsResponse?.data || [];
    const apiPagination = guardsResponse?.pagination;



    const {
        data: patrolData,
    } = useGetAllPatrolRunsForAdminQuery({
        page: 1,
        limit: 100,
    });

    const activePatrolGuardIds = useMemo(() => {
        if (!patrolData?.data) return [];

        const guardIdSet = new Set<string>();

        patrolData.data.forEach((run) => {
            const runStatus = String(run.status || "").toLowerCase();
            if (runStatus !== "upcoming" && runStatus !== "ongoing") return;

            if (Array.isArray(run.guards)) {
                run.guards.forEach((guard) => {
                    if (guard?.id) {
                        guardIdSet.add(String(guard.id));
                    }
                });
            }

            if (Array.isArray(run.guardIds)) {
                run.guardIds.forEach((guardId: any) => {
                    if (guardId) {
                        guardIdSet.add(String(guardId));
                    }
                });
            }
        });

        return Array.from(guardIdSet);
    }, [patrolData]);

    console.log(activePatrolGuardIds);

    const filteredGuards = useMemo(() => {
        return guards.filter((guard) =>
            activePatrolGuardIds.includes(guard.id)
        );
    }, [guards, activePatrolGuardIds]);

    const form = useForm<AlarmFormValues>({
        resolver: zodResolver(alarmSchema),
        defaultValues: {
            title: "",
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

    const { control, handleSubmit } = form;

    const onFormSubmit = async (data: AlarmFormValues) => {
        await onSubmit(data);
        form.reset();
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* TITLE */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Alarm Title</FieldLabel>
                            <Input {...field} placeholder="Brief alarm description" />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* SITE */}
                <Controller
                    name="siteId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Site</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select site" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sites.map((site: any) => (
                                        <SelectItem key={site.id} value={site.id}>
                                            {site.name}
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
                                    <SelectItem value="environmental">
                                        Environmental
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
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
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* GUARDS */}
                <Controller
                    name="guardIds"
                    control={control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Assigned Guards</FieldLabel>

                            <div className="border rounded p-2 max-h-60 overflow-y-auto">
                                {filteredGuards.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No guards available
                                    </p>
                                ) : (
                                    filteredGuards.map((guard: any) => {
                                        const isSelected = field.value?.includes(guard.id);

                                        return (
                                            <div
                                                key={guard.id}
                                                className="flex items-center gap-2 cursor-pointer"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        field.onChange(
                                                            field.value?.filter(
                                                                (id: string) => id !== guard.id
                                                            )
                                                        );
                                                    } else {
                                                        field.onChange([
                                                            ...(field.value || []),
                                                            guard.id,
                                                        ]);
                                                    }
                                                }}
                                            >
                                                <input type="checkbox" checked={isSelected} readOnly />
                                                <span>{guard.name}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
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
                            <Input type="number" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
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
                            <Input type="number" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
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
                            <Input type="number" {...field} />
                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
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
                    <p className="text-sm font-semibold text-gray-600">
                        Monitoring Details
                    </p>
                </div>

                {/* MONITORING COMPANY */}
                <Controller
                    name="monitoringCompany"
                    control={control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Monitoring Company</FieldLabel>
                            <Input {...field} />
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
                            <Input {...field} />
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
                                <Textarea {...field} rows={3} />
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