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

import { useState } from "react";
import ClientForm from "../Form/ClientForm";
import { Client, useEditClientMutation } from "@/apis/usersApi";
import { ClientFormValues } from "@/schemas";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

const EditClientModal = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false);

  const [editClient, { isLoading }] = useEditClientMutation();

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      await editClient({ id: client.id, body: data }).unwrap();
      toast.success("Client Edited Successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while Editing Client");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>

          <DialogDescription>
            Update client details
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