"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClientForm from "../Form/ClientForm";
import {  useCreateUserByAdminMutation,
} from "@/store/apis/usersApi";
import { ClientFormValues } from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";

const AddClientModal = () => {
  const [open, setOpen] = useState(false);
  const [createUserByAdmin, { isLoading }] = useCreateUserByAdminMutation();

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      await createUserByAdmin(data).unwrap();
      setOpen(false);
      toast.success("Client added successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to add client");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer rounded-full bg-linear-to-r from-sky-500 via-sky-600 to-sky-700">
          <Plus />
          Add Client
        </Button>
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add Client
          </DialogTitle>

          <DialogDescription>
            Enter client details and contact information
          </DialogDescription>
        </DialogHeader>

        <ClientForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
