import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  label: string;
  value: number | string;
  Icon?: LucideIcon;
  color?: string;
  to?: string;
}

const StatCard = ({
  label,
  value,
  Icon,
  color = "bg-slate-100 text-slate-700",
  to,
}: StatCardProps) => {
  const content = (
    <>
      {/* subtle glow */}
      <div
        className="
          absolute
          inset-0
          bg-linear-to-br
          from-slate-50/40
          via-transparent
          to-blue-50/30
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

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

      <div className="relative z-10 flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
          {value}
        </span>

        <span className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
      </div>
    </>
  );

  const className = cn(
    "group relative overflow-hidden",
    "flex items-center gap-4",
    "rounded-2xl border border-slate-200",
    "bg-white/90 backdrop-blur",
    "px-5 py-4",
    "shadow-sm",
    "transition-all duration-300",
    "hover:-translate-y-0.5 hover:shadow-md",
    "min-w-45",
    to && "cursor-pointer"
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

export default StatCard;