"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ImageUpload from "@/components/common/Image/ImageUpload";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { FormField } from "@/components/common/Form/FormField";

import { ClientFormValues, clientSchema } from "@/schemas";
import { Client } from "@/store/apis/usersApi";

interface ClientFormProps {
  initialData?: Client;
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
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      mobile: initialData?.mobile ?? "",
      address: initialData?.address ?? "",
      avatar: initialData?.avatar ?? "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const isEdit = !!initialData;

  return (
    <FormProvider {...form}>
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
              <Input
                {...field}
                disabled={isEdit}
                type="email"
                placeholder="Email"
              />
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
            required={!isEdit}
            render={(field) => (
              <PasswordInput {...field} placeholder="Password" />
            )}
          />

          <FormField
            control={control}
            name="address"
            label="Address"
            render={(field) => (
              <Textarea
                {...field}
                placeholder="Address"
                className="h-28 resize-none overflow-y-auto"
              />
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={!isValid || isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClientForm;
