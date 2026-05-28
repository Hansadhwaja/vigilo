import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";

import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    LogIn,
} from "lucide-react";

const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
    onSubmit: (values: LoginFormValues) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({
    onSubmit,
    isLoading,
}: Props) {
    const [showPassword, setShowPassword] =
        useState(false);

    const {
        control,
        handleSubmit,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* EMAIL */}
            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Email Address
                        </FieldLabel>

                        <div className="relative">
                            <Mail
                                className="
                                    absolute left-3 top-1/2
                                    h-4 w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <Input
                                {...field}
                                placeholder="admin@vigilo.com"
                                className="pl-10"
                            />
                        </div>

                        {fieldState.error && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />

            {/* PASSWORD */}
            <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Password
                        </FieldLabel>

                        <div className="relative">
                            <Lock
                                className="
                                    absolute left-3 top-1/2
                                    h-4 w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <Input
                                {...field}
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className="pl-10 pr-10"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                className="
                                    absolute right-3 top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    hover:text-slate-600
                                "
                            >
                                {showPassword ? (
                                    <Eye className="h-4 w-4" />
                                ) : (
                                    <EyeOff className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {fieldState.error && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />

            <Button
                type="submit"
                disabled={isLoading}
                className="
                    h-11
                    w-full
                    gap-2
                    bg-blue-600
                    hover:bg-blue-700
                "
            >
                <LogIn className="h-4 w-4" />

                {isLoading
                    ? "Signing In..."
                    : "Sign In"}
            </Button>
        </form>
    );
}