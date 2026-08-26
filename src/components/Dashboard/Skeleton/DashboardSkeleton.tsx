import StatCardsSkeleton from "@/components/common/StatCard/Skeleton/StatCardsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <section className="space-y-6">
      <StatCardsSkeleton count={5} />
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <StatCardsSkeleton count={4} />
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="mt-6 h-72 w-full rounded-xl" />
      </div>
    </section>
  );
}
