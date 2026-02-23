const SiteSkeletonLoader = () => {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full border border-gray-200 shadow-sm rounded-lg p-5 animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>

          {/* Checkpoints */}
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};