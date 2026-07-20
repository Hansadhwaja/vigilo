import PlanCardSkeleton from "./PlanCardSkeleton";

const PlanListSkeleton = () => {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PlanListSkeleton;
