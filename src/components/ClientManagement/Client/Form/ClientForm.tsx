"use client";

import { FormProvider, useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "@/components/common/ImageUpload/ImageUpload";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientFormValues, clientSchema } from "@/schemas";
import { Client } from "@/apis/usersApi";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface ClientFormProps {
    initialData: Client;
    onSubmit: (v: ClientFormValues) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const ClientForm = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}: ClientFormProps) => {

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            address: "",
            avatar: "",
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
            reset(initialData);
        }
    }, [initialData]);

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">

                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="Full Name"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="mobile"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Mobile Number</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder="Mobile Number"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="address"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Address</FieldLabel>
                                <Textarea
                                    {...field}
                                    placeholder="Address"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <ImageUpload
                        name="avatar"
                        label="Profile Picture"
                        buttonLabel="Upload Image"
                        single
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
                        Save Changes
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default ClientForm;