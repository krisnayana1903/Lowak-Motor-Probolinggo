export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/80">
      {/* Image placeholder */}
      <div className="aspect-square rounded-t-2xl bg-zinc-200 dark:bg-zinc-800" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badge row */}
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Title */}
        <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />

        {/* Price */}
        <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 flex-1 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
