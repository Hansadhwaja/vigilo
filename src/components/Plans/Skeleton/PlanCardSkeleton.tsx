import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PlanCardSkeleton = () => {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Badge */}
      <Skeleton className="absolute top-5 right-5 h-7 w-28 rounded-full" />

      <CardHeader className="space-y-6 pb-6 text-center">
        {/* Title & Description */}
        <div className="space-y-3">
          <Skeleton className="mx-auto h-8 w-36" />

          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-56" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-3">
          <Skeleton className="mx-auto h-12 w-36" />
          <Skeleton className="mx-auto h-4 w-28" />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="border-border/60 border-t pt-6">
          <Skeleton className="mb-5 h-5 w-32" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="mt-0.5 size-5 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-8">
        <Skeleton className="h-11 w-full rounded-xl" />
      </CardFooter>
    </Card>
  );
};

export default PlanCardSkeleton;