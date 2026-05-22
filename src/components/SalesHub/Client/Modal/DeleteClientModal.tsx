"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Client, useDeleteClientMutation } from "@/apis/usersApi";
import { toast } from "sonner";
import DeleteModal from "@/components/common/Modal/DeleteModal";

const DeleteClientModal = ({
    client,
}: {
    client: Client;
}) => {
    const [deleteClient, { isLoading }] = useDeleteClientMutation();

    const handleDelete = async () => {
        try {
            await deleteClient({
                id: client.id,
            }).unwrap();

            toast.success(
                "Client deleted successfully"
            );
        } catch (error) {
            console.log(error);

            toast.error(
                "Failed to delete client"
            );
        }
    };

    return (
        <DeleteModal
            title="Client"
            description={`Are you sure you want to delete ${client.name}? This action cannot be undone.`}
            onConfirm={handleDelete}
            isLoading={isLoading}
            trigger={
                <Button
                    variant="ghost"
                    size="sm"
                    className="
                w-full justify-start rounded-xl
                px-3 py-2 text-red-500
                transition-all
                hover:bg-red-50
                hover:text-red-600
            "
                >
                    <Trash2 className="mr-2 h-4 w-4" />

                    Delete Client
                </Button>
            }
        />
    );
};

export default DeleteClientModal;