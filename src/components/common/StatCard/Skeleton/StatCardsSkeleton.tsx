import StatCardSkeleton from "./StatCardSkeleton";

interface StatCardsSkeletonProps {
  count?: number;
}

const StatCardsSkeleton = ({ count = 4 }: StatCardsSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default StatCardsSkeleton;
