import PlanCardSkeleton from "./PlanCardSkeleton"

const PlanListSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default PlanListSkeleton
