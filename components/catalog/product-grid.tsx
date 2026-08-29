"use client";

import { PackageSearch } from "lucide-react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-8 py-20 dark:border-zinc-700 dark:bg-zinc-900/30">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <PackageSearch className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
          No parts found
        </h3>
        <p className="max-w-sm text-center text-sm text-zinc-500 dark:text-zinc-400">
          Try adjusting your filters or search criteria. We&apos;re constantly
          adding new inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
