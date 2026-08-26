import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => {
  return (
    <div
      className="
        flex items-center gap-4
        min-w-45
        rounded-2xl border border-slate-200
        bg-white/90
        px-5 py-4
        shadow-sm
      "
    >
      {/* Icon */}
      <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />

      {/* Content */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export default StatCardSkeleton;
