import { LucideIcon } from "lucide-react";

interface GuardMetaProps {
  label: string;
  value: string;
  Icon: LucideIcon;
}

const GuardMeta = ({ label, value, Icon }: GuardMetaProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
};

export default GuardMeta;