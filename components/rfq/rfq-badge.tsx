"use client";

import { ShoppingCart } from "lucide-react";
import { useRfqStore } from "@/store/rfq-store";
import { useEffect, useState } from "react";

export function RfqBadge() {
  const totalItems = useRfqStore((s) => s.totalItems);
  const toggleDrawer = useRfqStore((s) => s.toggleDrawer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? totalItems() : 0;

  return (
    <button
      onClick={toggleDrawer}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:bg-amber-400 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 sm:h-16 sm:w-16"
      aria-label={`Open RFQ basket (${count} items)`}
    >
      <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-bounce-in">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
