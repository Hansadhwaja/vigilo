import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  Icon?: LucideIcon;
  color?: string;
}

const StatCard = ({
  label,
  value,
  Icon,
  color = "bg-slate-100 text-slate-700",
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "flex items-center gap-4",
        "rounded-2xl border border-slate-200",
        "bg-white/90 backdrop-blur",
        "px-5 py-4",
        "shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md",
        "min-w-[180px]"
      )}
    >
      {/* subtle glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-slate-50/40
          via-transparent
          to-blue-50/30
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* icon */}
      {Icon && (
        <div
          className={cn(
            "relative z-10",
            "flex h-12 w-12 items-center justify-center",
            "rounded-2xl",
            "shadow-sm",
            "transition-transform duration-300 group-hover:scale-105",
            color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}

      {/* content */}
      <div className="relative z-10 flex flex-col">
        <span
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            leading-none
          "
        >
          {value}
        </span>

        <span
          className="
            mt-1
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-slate-500
          "
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default StatCard;