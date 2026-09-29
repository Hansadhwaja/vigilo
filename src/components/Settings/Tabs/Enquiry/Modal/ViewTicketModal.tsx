import { CalendarDays, Eye, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketType } from "@/types/enquiry/enquiry.types";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";

interface Props {
  ticket: TicketType;
}

const ViewTicketModal = ({ ticket }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enquiry Details
          </DialogTitle>

          <DialogDescription>
            View the complete details of this enquiry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Subject</p>

            <p className="text-base font-semibold">{ticket.subject}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Description</p>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="whitespace-pre-wrap text-sm leading-6">
                {ticket.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>

              <CustomBadge status={ticket.status} />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Source</p>

              <Badge variant="outline" className="capitalize">
                {ticket.senderType}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />

              <p className="text-sm font-medium">Sender Information</p>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>

                <p className="text-sm font-medium">{ticket.name || "N/A"}</p>
              </div>

              {ticket.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    {ticket.user.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t pt-4">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Created on {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketModal;
