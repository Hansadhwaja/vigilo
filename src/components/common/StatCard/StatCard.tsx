import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  Icon?: LucideIcon;
  color?: string; // only for icon accent now
}

const StatCard = ({
  label,
  value,
  Icon,
  color = "text-gray-600 bg-gray-100",
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl border bg-white",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "min-w-[140px]"
      )}
    >
      {Icon && (
        <div
          className={cn(
            "p-2 rounded-lg flex items-center justify-center",
            color
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900 leading-none">
          {value}
        </span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;