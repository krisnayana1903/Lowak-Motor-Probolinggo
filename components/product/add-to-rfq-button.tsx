"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/catalog";
import { useRfqStore } from "@/store/rfq-store";

interface AddToRfqButtonProps {
  product: Product;
}

export function AddToRfqButton({ product }: AddToRfqButtonProps) {
  const addItem = useRfqStore((s) => s.addItem);
  const openDrawer = useRfqStore((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-500 px-6 py-4 text-sm font-bold text-amber-600 transition-all hover:bg-amber-50 disabled:border-emerald-500 disabled:text-emerald-600 active:scale-[0.98] dark:text-amber-400 dark:hover:bg-amber-950/20 dark:disabled:border-emerald-500 dark:disabled:text-emerald-400"
    >
      <ShoppingCart className="h-5 w-5" />
      {added ? "Added to RFQ ✓" : "Add to RFQ Basket"}
    </button>
  );
}
