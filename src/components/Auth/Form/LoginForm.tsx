import {
  type ControllerRenderProps,
  type Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { LogIn } from "lucide-react";

import { FormField } from "@/components/common/Form/FormField";
import PasswordInput from "@/components/common/Input/PasswordInput";
import Loader from "@/components/common/Loader";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  LoginFormValues,
  loginSchema,
} from "@/schemas/auth/auth.schemas";

type LoginField = {
  name: Path<LoginFormValues>;
  label: string;
  render: (
    field: ControllerRenderProps<LoginFormValues, Path<LoginFormValues>>,
  ) => React.ReactNode;
};

interface Props {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: Props) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  const fields: LoginField[] = useMemo(
    () => [
      {
        name: "email",
        label: "Email Address",
        render: (field) => (
          <Input
            {...field}
            type="email"
            placeholder="admin@vigilo.com"
            autoComplete="email"
          />
        ),
      },
      {
        name: "password",
        label: "Password",
        render: (field) => (
          <PasswordInput
            {...field}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        ),
      },
    ],
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {fields.map((field) => (
        <FormField
          key={field.name}
          control={control}
          name={field.name}
          label={field.label}
          render={field.render}
        />
      ))}

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="h-11 w-full gap-2"
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <LogIn className="size-4" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
};