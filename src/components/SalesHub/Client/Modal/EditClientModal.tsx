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
import { Edit } from "lucide-react";
import ClientForm from "../Form/ClientForm";
import { Client, useEditClientMutation } from "@/apis/usersApi";
import { ClientFormValues } from "@/schemas";
import { toast } from "sonner";

const EditClientModal = ({
  client,
  open,
  setOpen,
}: {
  client: Client;
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const [editClient, { isLoading }] = useEditClientMutation();

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      await editClient({
        id: client.id,
        body: data,
      }).unwrap();

      toast.success("Client details updated successfully");

      setOpen(false);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update client details");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
  
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Edit Client
          </DialogTitle>

          <DialogDescription>
            Update client details and contact information
          </DialogDescription>
        </DialogHeader>

        <ClientForm
          initialData={client}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
