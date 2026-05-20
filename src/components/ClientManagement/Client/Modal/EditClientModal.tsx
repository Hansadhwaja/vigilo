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

import {
  Edit,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import ClientForm from "../Form/ClientForm";

import {
  Client,
  useEditClientMutation,
} from "@/apis/usersApi";

import { ClientFormValues } from "@/schemas";

import { toast } from "sonner";

const EditClientModal = ({
  client,
}: {
  client: Client;
}) => {
  const [open, setOpen] = useState(false);

  const [editClient, { isLoading }] =
    useEditClientMutation();

  const handleSubmit = async (
    data: ClientFormValues
  ) => {
    try {
      await editClient({
        id: client.id,
        body: data,
      }).unwrap();

      toast.success(
        "Client updated successfully"
      );

      setOpen(false);
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to update client"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="
            w-full justify-start rounded-xl
            px-3 py-2 text-slate-700
            transition-all
            hover:bg-orange-50
            hover:text-orange-600
          "
        >
          <Edit className="mr-2 h-4 w-4" />

          Edit Client
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-h-[92vh] max-w-3xl overflow-hidden
          rounded-3xl border-0 p-0
        "
      >
        {/* TOP HEADER */}
        <div
          className="
            relative overflow-hidden
            bg-linear-to-r
            from-orange-500
            via-orange-400
            to-sky-500
            p-4 text-white
          "
        >
          <div className="absolute inset-0 bg-black/5" />

          <DialogHeader className="relative">
            <div className="flex gap-2 items-center">
              <div
                className="
                flex h-14 w-14 items-center
                justify-center rounded-2xl
                bg-white/15 backdrop-blur
              "
              >
                <Sparkles className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Edit Client
                </DialogTitle>

                <DialogDescription className="text-white/80">
                  Update client details and
                  contact information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        <div
          className="
            max-h-[70vh] overflow-y-auto
            bg-slate-50/40 p-4
          "
        >

          <ClientForm
            initialData={client}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            isLoading={isLoading}
          />

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;