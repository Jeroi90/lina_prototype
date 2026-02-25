import { Skeleton } from "@/components/ui/skeleton";

export function FeedCardSkeleton() {
  return (
    <div className="bg-white p-5 border-b border-gray-100">
      <div className="flex justify-between mb-2">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2 rounded" />
      <Skeleton className="h-5 w-full mb-2 rounded" />
      <Skeleton className="h-4 w-full mb-1 rounded" />
      <Skeleton className="h-4 w-2/3 mb-3 rounded" />
      <div className="flex gap-3 pt-3 border-t border-gray-50">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    </div>
  );
}

export function BestCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-1 mb-2">
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
      <Skeleton className="h-4 w-full mb-1 rounded" />
      <Skeleton className="h-3 w-3/4 rounded" />
    </div>
  );
}

export function BalanceCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[280px] rounded-2xl border border-gray-100 overflow-hidden bg-white">
      <Skeleton className="h-[130px] w-full rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-6 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="h-3 w-24 mx-auto rounded" />
      </div>
    </div>
  );
}
