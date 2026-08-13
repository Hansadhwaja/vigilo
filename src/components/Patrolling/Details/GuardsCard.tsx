import { ShieldCheck } from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { Badge } from "@/components/ui/badge";

interface GuardsCardProps {
  guards: any[];
}

const GuardsCard = ({ guards }: GuardsCardProps) => {
  return (
    <SectionCard
      title={`Assigned Guards (${guards.length})`}
      icon={<ShieldCheck className="h-5 w-5" />}
      description="Guards assigned to this patrol"
    >
      <div className="space-y-3">
        {guards.map((guard) => (
          <div
            key={guard.id}
            className="flex items-center justify-between gap-3 rounded-xl border bg-slate-50/50 p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={guard.avatar || "https://via.placeholder.com/40"}
                alt={guard.name}
                className="h-10 w-10 shrink-0 rounded-full border object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{guard.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                  {guard.email || "-"}
                </p>
              </div>
            </div>

            <Badge className="capitalize">{guard.guardStatus}</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default GuardsCard;
