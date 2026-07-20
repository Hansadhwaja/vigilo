import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const PlanCardSkeleton = () => {
  return (
    <Card className="relative">

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-44" />
          </div>

          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-11 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-10" />
        </div>
      </CardFooter>
    </Card>
  )
}

export default PlanCardSkeleton
