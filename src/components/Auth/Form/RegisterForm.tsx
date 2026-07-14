import {
  type ControllerRenderProps,
  type Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/auth/auth.schemas";

import { FormField } from "@/components/common/Form/FormField";
import Loader from "@/components/common/Loader";
import PasswordInput from "@/components/common/Input/PasswordInput";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RegisterField = {
  name: Path<RegisterFormValues>;
  label: string;
  className?: string;
  render: (
    field: ControllerRenderProps<RegisterFormValues, Path<RegisterFormValues>>,
  ) => React.ReactNode;
};

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  isLoading: boolean;
}

const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  const fields: RegisterField[] = useMemo(
    () => [
      {
        name: "name",
        label: "Company Name",
        render: (field) => (
          <Input {...field} placeholder="Enter company name" />
        ),
      },
      {
        name: "email",
        label: "Email Address",
        render: (field) => (
          <Input
            {...field}
            type="email"
            placeholder="admin@company.com"
            autoComplete="email"
          />
        ),
      },
      {
        name: "mobile",
        label: "Mobile Number",
        render: (field) => (
          <Input
            {...field}
            type="tel"
            placeholder="Enter mobile number"
            autoComplete="tel"
          />
        ),
      },
      {
        name: "password",
        label: "Password",
        render: (field) => (
          <PasswordInput
            {...field}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        ),
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        render: (field) => (
          <PasswordInput
            {...field}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        ),
      },
      {
        name: "address",
        label: "Address",
        className: "sm:col-span-2",
        render: (field) => (
          <Textarea
            {...field}
            placeholder="Enter company address"
            autoComplete="street-address"
          />
        ),
      },
    ],
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.className}>
            <FormField
              control={control}
              name={field.name}
              label={field.label}
              render={field.render}
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={!isValid || isLoading} className="w-full">
        {isLoading ? <Loader /> : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;