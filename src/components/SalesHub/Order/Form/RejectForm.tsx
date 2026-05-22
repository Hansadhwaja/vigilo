
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";


import {
    RejectOrderFormValues,
    rejectOrderSchema,
} from "@/schemas";


interface RejectOrderFormProps {
    onSubmit: (d: RejectOrderFormValues) => Promise<void> | void;
    isLoading: boolean;
    onCancel: () => void;
}

const RejectOrderForm = ({
    onSubmit,
    isLoading,
    onCancel,
}: RejectOrderFormProps) => {

    const form = useForm<RejectOrderFormValues>({
        resolver: zodResolver(rejectOrderSchema),
        mode: "onChange",
        defaultValues: {
            reason: "",
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid },
    } = form;

    const onFormSubmit = async (
        data: RejectOrderFormValues
    ) => {
        await onSubmit(data);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-6"
        >
            <Controller
                name="reason"
                control={control}
                render={({
                    field,
                    fieldState,
                }) => (
                    <Field>
                        <FieldLabel>
                            Rejection Reason
                        </FieldLabel>

                        <Textarea
                            {...field}
                            placeholder="Please provide a reason for rejection..."
                        />

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />

            <div className="flex justify-end gap-2">
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
                        !isValid || isLoading
                    }
                    className="bg-red-600 hover:bg-red-700"
                >
                    {isLoading ? <Loader className="w-4 h-4" /> : " Reject Order"}


                </Button>
            </div>
        </form>
    );
};

export default RejectOrderForm;