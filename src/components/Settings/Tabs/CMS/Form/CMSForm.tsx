"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/Form/FormField";
import { Save } from "lucide-react";
import z from "zod";
import TinyEditor from "@/components/common/Editor/TinyEditor";

interface Props {
  initialData?: CMSFormValue;
  onSubmit: (v: CMSFormValue) => void;
  isLoading: boolean;
}

const cmsSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export type CMSFormValue = z.infer<typeof cmsSchema>;

const CMSForm = ({ initialData, onSubmit, isLoading }: Props) => {
  const form = useForm<CMSFormValue>({
    resolver: zodResolver(cmsSchema),
    mode: "onChange",
    defaultValues: {
      content: initialData?.content ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={control}
        name="content"
        label="Content"
        render={(field) => (
          <TinyEditor value={field.value} onChange={field.onChange} />
        )}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={!isValid || isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </form>
  );
};

export default CMSForm;
