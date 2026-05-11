"use client";

import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeSheetFormValues, timeSheetSchema } from "@/schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Loader from "@/components/common/Loader";
import { TimeSheet } from "@/types";
import { convertTo24Hour } from "@/lib/utils";

interface TimeSheetFormProps {
    initialData?: TimeSheet;
    onSubmit: (v: TimeSheetFormValues) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const TimeSheetForm = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: TimeSheetFormProps) => {

    const form = useForm<TimeSheetFormValues>({
        resolver: zodResolver(timeSheetSchema),
        mode: "onChange",
        defaultValues: {
            shiftStartTime: "",
            shiftEndTime: "",
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid },
    } = form;

    useEffect(() => {
        if (initialData) {
            reset({
                shiftStartTime: convertTo24Hour(
                    initialData.shiftStartTime
                ),

                shiftEndTime: convertTo24Hour(
                    initialData.shiftEndTime
                ),
            });
        }
    }, [initialData, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-4">
                <Controller
                    name="shiftStartTime"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Start Time</FieldLabel>
                            <Input
                                type="time"
                                {...field}
                                placeholder="Start Time"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="shiftEndTime"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>End Time</FieldLabel>
                            <Input
                                {...field}
                                type="time"
                                placeholder="End Time"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

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
                    disabled={!isValid || isLoading}
                >
                    {isLoading ? <Loader /> : initialData ? "Edit Guard" : "Add Guard"}
                </Button>
            </div>
        </form>
    );
};

export default TimeSheetForm;