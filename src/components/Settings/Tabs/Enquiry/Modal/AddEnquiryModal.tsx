import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquarePlus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import EnquiryForm from "../Form/EnquiryForm";
import { useCreateTicketMutation } from "@/store/apis/enquiryApis";
import { useGetProfileQuery } from "@/store/apis/profileApi";
import { EnquiryFormValues } from "@/schemas/enquiry/enquiry.schema";

const AddEnquiryModal = () => {
  const [open, setOpen] = useState(false);

  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery();

  const profile = profileResponse?.data;

  const handleSubmit = async (data: EnquiryFormValues) => {
    if (!profile?.name) {
      toast.error("Unable to load your profile information");
      return;
    }

    try {
      await createTicket({
        ...data,
        name: profile.name,
        senderType: "company",
        userId: profile?.id,
      }).unwrap();

      toast.success("Enquiry raised successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create enquiry:", error);
      toast.error("Failed to raise enquiry. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer rounded-full bg-linear-to-r from-sky-500 via-sky-600 to-sky-700 shadow-sm transition-all hover:shadow-md"
          disabled={isProfileLoading}
        >
          <Plus className="h-4 w-4" />
          Raise Enquiry
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            Raise New Enquiry
          </DialogTitle>

          <DialogDescription>
            Submit your enquiry by providing a subject and a brief description.
          </DialogDescription>
        </DialogHeader>

        <EnquiryForm
          onSubmit={handleSubmit}
          isLoading={isLoading || isProfileLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEnquiryModal;
