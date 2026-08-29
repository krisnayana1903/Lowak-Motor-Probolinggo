"use client";

import Link from "next/link";
import { ShoppingCart, Eye, CheckCircle, XCircle } from "lucide-react";
import type { Product } from "@/types/catalog";
import { useRfqStore } from "@/store/rfq-store";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useRfqStore((s) => s.addItem);
  const openDrawer = useRfqStore((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const handleAddToRfq = () => {
    addItem(product);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 1500);
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-part.svg";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:shadow-zinc-900/50">
      {/* Image */}
      <Link href={`/parts/${product.slug}`} className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Stock badge overlay */}
        <div className="absolute right-3 top-3">
          {product.is_in_stock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <XCircle className="h-3 w-3" />
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Badges */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {product.part_number}
          </span>
          <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            {product.condition}
          </span>
        </div>

        {/* Title */}
        <Link href={`/parts/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors hover:text-amber-600 dark:text-zinc-100 dark:hover:text-amber-400">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto mb-3">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            ${product.price_usd.toFixed(2)}
          </span>
          <span className="ml-1 text-xs text-zinc-400">USD</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/parts/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>
          <button
            onClick={handleAddToRfq}
            disabled={added}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-semibold text-white transition-all hover:bg-amber-600 disabled:bg-emerald-500 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "Added ✓" : "Add to RFQ"}
          </button>
        </div>
      </div>
    </div>
  );
}
