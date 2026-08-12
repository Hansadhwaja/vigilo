import { Mail, Phone, User } from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { Button } from "@/components/ui/button";

interface ClientCardProps {
  client: any;
}

const ClientCard = ({
  client,
}: ClientCardProps) => {
  return (
    <SectionCard
      title="Client Information"
      icon={<User className="h-5 w-5" />}
      description="Client assigned to this patrol"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={
              client?.avatar ||
              "https://via.placeholder.com/48"
            }
            alt={client?.name || "Client"}
            className="h-12 w-12 rounded-full border object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">
              {client?.name || "-"}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {client?.id || "-"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="truncate">
              {client?.email || "-"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>
              {client?.mobile || "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </div>
    </SectionCard>
  );
};

export default ClientCard;