"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Client, useDeleteClientMutation } from "@/apis/usersApi";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";

const DeleteClientModal = ({ client }: { client: Client }) => {
    const [open, setOpen] = useState(false);

    const [deleteClient, { isLoading }] = useDeleteClientMutation();

    const handleDelete = async () => {
        try {
            await deleteClient({ id: client.id }).unwrap();

            toast.success("Client Deleted Successfully");

            setOpen(false);
        } catch (error) {
            console.log(error);

            toast.error("Error while deleting client");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-500 cursor-pointer hover:text-red-600"
                >
                    <Trash2 className="text-red-500" />
                    Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Client
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {client.name}
                        </span>
                        ?
                        <br />
                        <br />
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? (
                            <Loader className="w-4 h-4" />
                        ) : (
                            "Delete Client"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteClientModal;