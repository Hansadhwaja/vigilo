import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  EnquiryFormValues,
  enquirySchema,
} from "@/schemas/enquiry/enquiry.schema";
import Loader from "@/components/common/Loader";
import { FormField } from "@/components/common/Form/FormField";
import { TicketType } from "@/types/enquiry/enquiry.types";

interface Props {
  initialData?: TicketType;
  onSubmit: (values: EnquiryFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EnquiryForm = ({ initialData, onSubmit, onCancel, isLoading }: Props) => {
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
    defaultValues: {
      subject: initialData?.subject ?? "",
      description: initialData?.description ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const onFormSubmit = (values: EnquiryFormValues) => {
    onSubmit(values);
  };

  const isEditMode = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-5">
        <FormField
          control={control}
          name="subject"
          label="Subject"
          render={(field) => (
            <Input
              {...field}
              placeholder="Enter enquiry subject"
              disabled={isLoading}
            />
          )}
        />

        <FormField
          control={control}
          name="description"
          label="Description"
          render={(field) => (
            <Textarea
              {...field}
              placeholder="Describe your enquiry..."
              className="min-h-28 resize-none"
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="min-w-28"
        >
          {isLoading ? (
            <Loader />
          ) : isEditMode ? (
            "Update Enquiry"
          ) : (
            "Raise Enquiry"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EnquiryForm;
