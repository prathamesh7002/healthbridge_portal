export function ReportCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-1">
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}

export function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
