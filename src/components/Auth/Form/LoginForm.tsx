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

import { Eye, EyeOff } from "lucide-react";


// ✅ Schema
const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
    onSubmit: (values: LoginFormValues) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Email</FieldLabel>

                        <Input
                            placeholder="admin@example.com"
                            {...field}
                        />

                        {fieldState.invalid && fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
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
                        <FieldLabel>Password</FieldLabel>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                className="pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <Eye className="h-4 w-4" />
                                ) : (
                                    <EyeOff className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {fieldState.invalid && fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* SUBMIT */}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
            </Button>
        </form>
    );
}