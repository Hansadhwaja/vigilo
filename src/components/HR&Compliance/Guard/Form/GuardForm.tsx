"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/common/Loader";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { FormField } from "@/components/common/Form/FormField";

import { GuardFormValues, guardSchema } from "@/schemas";
import { Client } from "@/store/apis/usersApi";

interface GuardFormProps {
  initialData?: Client;
  onSubmit: (v: GuardFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const GuardForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: GuardFormProps) => {
  const form = useForm<GuardFormValues>({
    resolver: zodResolver(guardSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
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
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        mobile: initialData.mobile ?? "",
        password: "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="name"
          label="Full Name"
          render={(field) => <Input {...field} placeholder="Full Name" />}
        />

        <FormField
          control={control}
          name="email"
          label="Email"
          render={(field) => (
            <Input {...field} type="email" placeholder="Email" />
          )}
        />

        <FormField
          control={control}
          name="mobile"
          label="Mobile Number"
          render={(field) => <Input {...field} placeholder="Mobile Number" />}
        />

        <FormField
          control={control}
          name="password"
          label="Password"
          render={(field) => (
            <PasswordInput {...field} placeholder="Password" />
          )}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={!isValid || isLoading}>
          {isLoading ? <Loader /> : initialData ? "Edit Guard" : "Add Guard"}
        </Button>
      </div>
    </form>
  );
};

export default GuardForm;
