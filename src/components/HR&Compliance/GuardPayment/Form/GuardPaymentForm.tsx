import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import Loader from "@/components/common/Loader";
import {
    GuardPaymentFormValues,
    guardPaymentSchema,
} from "@/schemas";
import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import {
    useGetGuardTimeSheetSummaryQuery,
} from "@/apis/schedulingAPI";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface GuardPaymentFormProps {
    initialData?: any;
    onSubmit: (v: GuardPaymentFormValues) => void;
    onCancel: () => void;
    isLoading: boolean;
}

interface GuardTimeSheetDetails {
    date: string;
    endTime: string;
    overtimeHours: number | null;
    regularHours: number;
    shiftId: string;
    startTime: string;
    totalHours: string | null;
}

const GuardPaymentForm = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: GuardPaymentFormProps) => {
    const {
        data: guardsRes,
        isLoading: isGuardsLoading,
    } = useGetAllGuardsQuery();

    const guards = guardsRes?.data ?? [];

    const form = useForm<GuardPaymentFormValues>({
        resolver: zodResolver(guardPaymentSchema),
        mode: "onChange",
        defaultValues: {
            guardId: "",

            fromDate: "",
            toDate: "",

            staticIds: [],

            hourlyRate: 0,
            overtimeHourlyRate: 0,

            regularHours: 0,
            overtimeHours: 0,
            totalHours: 0,

            taxDeduction: 0,
            otherDeductions: 0,

            basePay: 0,
            overtimePay: 0,
            totalPay: 0,
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { isValid },
    } = form;

    const guardId = watch("guardId");

    const fromDate = watch("fromDate");
    const toDate = watch("toDate");

    const hourlyRate =
        watch("hourlyRate");

    const overtimeHourlyRate =
        watch("overtimeHourlyRate");

    const regularHours =
        watch("regularHours");

    const overtimeHours =
        watch("overtimeHours");

    const taxDeduction =
        watch("taxDeduction");

    const otherDeductions =
        watch("otherDeductions");

    const basePay = watch("basePay");

    const overtimePay =
        watch("overtimePay");

    const totalPay = watch("totalPay");


    const {
        data: summaryData,
        isLoading: isSummaryLoading,
    } = useGetGuardTimeSheetSummaryQuery(
        {
            guardId,
            fromDate,
            toDate,
            details: true,
        },
        {
            skip:
                !guardId ||
                !fromDate ||
                !toDate,
        }
    );


    useEffect(() => {
        if (!summaryData?.data) return;

        const summary =
            summaryData.data.summary;

        const shiftIds =
            summaryData.data.details.map(
                (
                    s: GuardTimeSheetDetails
                ) => s.shiftId
            );

        setValue(
            "staticIds",
            shiftIds || []
        );

        setValue(
            "regularHours",
            summary.totalRegularHours || 0
        );

        setValue(
            "overtimeHours",
            summary.totalOvertimeHours || 0
        );
    }, [summaryData, setValue]);

    useEffect(() => {
        const calculatedBasePay =
            hourlyRate * regularHours;

        const calculatedOvertimePay =
            overtimeHourlyRate *
            overtimeHours;

        const calculatedTotalHours =
            regularHours +
            overtimeHours;

        const calculatedTotalPay =
            calculatedBasePay +
            calculatedOvertimePay -
            taxDeduction -
            otherDeductions;

        setValue(
            "basePay",
            Number(
                calculatedBasePay.toFixed(
                    2
                )
            )
        );

        setValue(
            "overtimePay",
            Number(
                calculatedOvertimePay.toFixed(
                    2
                )
            )
        );

        setValue(
            "totalHours",
            Number(
                calculatedTotalHours.toFixed(
                    2
                )
            )
        );

        setValue(
            "totalPay",
            Number(
                calculatedTotalPay.toFixed(
                    2
                )
            )
        );
    }, [
        hourlyRate,
        overtimeHourlyRate,
        regularHours,
        overtimeHours,
        taxDeduction,
        otherDeductions,
        setValue,
    ]);

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <FieldGroup className="flex flex-col gap-2">
                <FieldLabel className="border-l-2 border-blue-500 px-2 text-base font-semibold text-blue-600">
                    Guard Selection
                </FieldLabel>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Controller
                        name="guardId"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Guard
                                </FieldLabel>

                                <Select
                                    value={
                                        field.value
                                    }
                                    onValueChange={
                                        field.onChange
                                    }
                                >
                                    <SelectTrigger>
                                        {isGuardsLoading ? (
                                            <Loader />
                                        ) : (
                                            <SelectValue placeholder="Select Guard" />
                                        )}
                                    </SelectTrigger>

                                    <SelectContent>
                                        {guards.map(
                                            (
                                                g
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        g.id
                                                    }
                                                    value={
                                                        g.id
                                                    }
                                                >
                                                    {
                                                        g.name
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="fromDate"
                        control={control}
                        render={({
                            field,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    From
                                    Date
                                </FieldLabel>

                                <Input
                                    type="date"
                                    {...field}
                                />
                            </Field>
                        )}
                    />

                    <Controller
                        name="toDate"
                        control={control}
                        render={({
                            field,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    To Date
                                </FieldLabel>

                                <Input
                                    type="date"
                                    {...field}
                                />
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>

            {isSummaryLoading && (
                <div className="flex justify-center py-6">
                    <Loader />
                </div>
            )}

            <FieldGroup className="flex flex-col gap-2">
                   <FieldLabel className="border-l-2 border-blue-500 px-2 text-base font-semibold text-blue-600">
                    Work Summary
                </FieldLabel>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Controller
                        name="regularHours"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Regular
                                    Hours
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="overtimeHours"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Overtime
                                    Hours
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="totalHours"
                        control={control}
                        render={({
                            field,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Total
                                    Hours
                                </FieldLabel>

                                <Input
                                    {...field}
                                    readOnly
                                />
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>

            <FieldGroup className="flex flex-col gap-2">
            <FieldLabel className="border-l-2 border-blue-500 px-2 text-base font-semibold text-blue-600">
                    Rate Configuration
                </FieldLabel>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Controller
                        name="hourlyRate"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Hourly
                                    Rate
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="overtimeHourlyRate"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Overtime
                                    Hourly
                                    Rate
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>

            <FieldGroup className="flex flex-col gap-2">
              <FieldLabel className="border-l-2 border-blue-500 px-2 text-base font-semibold text-blue-600">
                    Deductions
                </FieldLabel>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Controller
                        name="taxDeduction"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Tax
                                    Deduction
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="otherDeductions"
                        control={control}
                        render={({
                            field,
                            fieldState,
                        }) => (
                            <Field>
                                <FieldLabel>
                                    Other
                                    Deductions
                                </FieldLabel>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(
                                        e
                                    ) =>
                                        field.onChange(
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                />

                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[
                                            fieldState.error,
                                        ]}
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>

            <FieldGroup className="flex flex-col gap-2">
                <FieldLabel className="border-l-2 border-blue-500 px-2 text-base font-semibold text-blue-600">
                    Payment Summary
                </FieldLabel>

                <Card className="overflow-hidden rounded-2xl border border-blue-200 bg-slate-100 shadow-sm p-0">
                    <CardContent className="space-y-2 p-4">
                        <div className="flex items-center justify-between description">
                            <p className="text-muted-foreground">
                                Base Pay (
                                {
                                    regularHours
                                }
                                h × $
                                {
                                    hourlyRate
                                }
                                )
                            </p>

                            <p className="font-medium">
                                {formatCurrency(
                                    basePay
                                )}
                            </p>
                        </div>

                        <div className="flex items-center justify-between description">
                            <p className="text-muted-foreground">
                                Overtime
                                Pay (
                                {
                                    overtimeHours
                                }
                                h × $
                                {
                                    overtimeHourlyRate
                                }
                                )
                            </p>

                            <p className="font-medium">
                                {formatCurrency(
                                    overtimePay
                                )}
                            </p>
                        </div>

                        <div className="border-t border-slate-300" />

                        <div className="flex items-center justify-between description">
                            <p className="text-muted-foreground">
                                Subtotal
                            </p>

                            <p className="font-medium">
                                {formatCurrency(
                                    basePay +
                                    overtimePay
                                )}
                            </p>
                        </div>

                        <div className="flex items-center justify-between description">
                            <p className="text-muted-foreground">
                                Tax
                                Deduction
                            </p>

                            <p className="font-medium text-red-500">
                                -
                                {formatCurrency(
                                    taxDeduction
                                )}
                            </p>
                        </div>

                        <div className="flex items-center justify-between description">
                            <p className="text-muted-foreground">
                                Other
                                Deduction
                            </p>

                            <p className="font-medium text-red-500">
                                -
                                {formatCurrency(
                                    otherDeductions
                                )}
                            </p>
                        </div>

                        <div className="border-t border-slate-300 pt-2" />

                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold">
                                Total
                                Pay
                            </p>

                            <p className="text-2xl font-bold text-emerald-600">
                                {formatCurrency(
                                    totalPay
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </FieldGroup>


            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        !isValid ||
                        isLoading
                    }
                >
                    {isLoading ? (
                        <Loader />
                    ) : initialData ? (
                        "Update Payment"
                    ) : (
                        "Add Payment"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default GuardPaymentForm;