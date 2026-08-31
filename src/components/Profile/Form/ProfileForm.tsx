import {
  type ControllerRenderProps,
  type Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

import { FormField } from "@/components/common/Form/FormField";
import Loader from "@/components/common/Loader";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ProfileFormValues,
  profileSchema,
} from "@/schemas/profile/profile.schema";

type ProfileField = {
  name: Path<ProfileFormValues>;
  label: React.ReactNode;
  className?: string;
  render: (
    field: ControllerRenderProps<ProfileFormValues, Path<ProfileFormValues>>,
  ) => React.ReactNode;
};

interface Props {
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  isLoading: boolean;
  initialData: ProfileFormValues;
}

const ProfileForm = ({ onSubmit, isLoading, initialData }: Props) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      mobile: initialData?.mobile ?? "",
      address: initialData?.address ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  const fields: ProfileField[] = useMemo(
    () => [
      {
        name: "name",
        label: (
          <>
            Company Name <span className="text-destructive">*</span>
          </>
        ),
        render: (field) => (
          <Input {...field} placeholder="Enter company name" />
        ),
      },
      {
        name: "mobile",
        label: (
          <>
            Mobile Number <span className="text-destructive">*</span>
          </>
        ),
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
        name: "address",
        label: (
          <>
            Address <span className="text-destructive">*</span>
          </>
        ),
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

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full text-base"
      >
        {isLoading ? <Loader /> : "Edit Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;
