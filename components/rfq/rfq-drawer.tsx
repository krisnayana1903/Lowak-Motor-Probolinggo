"use client";

import {
  X,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import { useRfqStore } from "@/store/rfq-store";
import { useEffect, useState } from "react";

export function RfqDrawer() {
  const isOpen = useRfqStore((s) => s.isDrawerOpen);
  const closeDrawer = useRfqStore((s) => s.closeDrawer);
  const items = useRfqStore((s) => s.items);
  const removeItem = useRfqStore((s) => s.removeItem);
  const updateQuantity = useRfqStore((s) => s.updateQuantity);
  const clearBasket = useRfqStore((s) => s.clearBasket);
  const getWhatsAppUrl = useRfqStore((s) => s.getWhatsAppUrl);
  const totalItems = useRfqStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleSendRfq = () => {
    const url = getWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-900 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40">
              <ShoppingCart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                RFQ Basket
              </h2>
              <p className="text-xs text-zinc-500">
                {totalItems()} item{totalItems() !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <ShoppingCart className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-zinc-700 dark:text-zinc-300">
                Your basket is empty
              </h3>
              <p className="text-sm text-zinc-500">
                Add parts to your RFQ basket to request a quote via WhatsApp.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  {/* Image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-zinc-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-500">{item.part_number}</p>
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      ${item.price_usd.toFixed(2)} USD
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-200 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-4 space-y-3 dark:border-zinc-800">
            <button
              onClick={handleSendRfq}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Send RFQ via WhatsApp
            </button>
            <button
              onClick={clearBasket}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-6 py-2.5 text-xs font-medium text-zinc-500 transition-all hover:border-red-200 hover:text-red-500 dark:border-zinc-700 dark:hover:border-red-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Basket
            </button>
          </div>
        )}
      </div>
    </>
  );
}
