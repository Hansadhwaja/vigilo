import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InfoItemProps {
  label: string;

  value?: React.ReactNode;

  icon?: React.ReactNode;

  className?: string;

  labelClassName?: string;

  valueClassName?: string;

  direction?: "row" | "column";

  compact?: boolean;
}

const InfoItem = ({
  label,
  value,
  icon,
  className,
  labelClassName,
  valueClassName,
  direction = "column",
  compact = false,
}: InfoItemProps) => {
  return (
    <div
      className={cn(
        `
          rounded-2xl border border-slate-200
          bg-slate-50/60
        `,
        compact ? "p-3" : "p-4",
        direction === "row" &&
          "flex items-start gap-4",
        className
      )}
    >
      {icon && (
        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl bg-primary/10
            text-primary
          "
        >
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Label
          className={cn(
            `
              text-sm font-semibold uppercase
              tracking-wide text-slate-500
            `,
            labelClassName
          )}
        >
          {label}
        </Label>

        <div
          className={cn(
            `
              mt-2 wrap-break-word
              text-sm font-medium
              text-slate-800
            `,
            valueClassName
          )}
        >
          {value || "—"}
        </div>
      </div>
    </div>
  );
};

export default InfoItem;