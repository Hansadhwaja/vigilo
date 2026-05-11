
import { Client } from "@/apis/usersApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

const ViewClientModal = ({ client }: { client: Client }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                >
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">

                <DialogHeader>
                    <DialogTitle>
                        Client Details
                    </DialogTitle>
                </DialogHeader>

                <div>
                    <img src={client.avatar} />

                    <h2>{client.name}</h2>

                    <p>{client.email}</p>

                    <p>{client.mobile}</p>

                    <p>{client.address}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewClientModal;