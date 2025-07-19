export default function SkeletonCard() {
  return (
    <div className="animate-pulse border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="h-28 bg-gray-700/50 rounded" />
      <div className="h-3 bg-gray-700/50 rounded w-3/4" />
      <div className="h-3 bg-gray-700/50 rounded w-1/2" />
    </div>
  );
}
