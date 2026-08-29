"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, RfqItem } from "@/types/catalog";

interface RfqState {
  items: RfqItem[];
  isDrawerOpen: boolean;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearBasket: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Computed
  totalItems: () => number;
  generateWhatsAppMessage: () => string;
  getWhatsAppUrl: () => string;
}

export const useRfqStore = create<RfqState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                slug: product.slug,
                part_number: product.part_number,
                price_usd: product.price_usd,
                condition: product.condition,
                image:
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : null,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearBasket: () => set({ items: [] }),

      toggleDrawer: () =>
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      generateWhatsAppMessage: () => {
        const { items } = get();
        if (items.length === 0) return "";

        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

        let message = `🏍️ *REQUEST FOR QUOTATION*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        items.forEach((item, index) => {
          message += `*${index + 1}. ${item.title}*\n`;
          message += `   Part #: ${item.part_number}\n`;
          message += `   Condition: ${item.condition}\n`;
          message += `   Ref. Price: $${item.price_usd.toFixed(2)}\n`;
          message += `   Qty: ${item.quantity}\n`;
          if (baseUrl) {
            message += `   🔗 ${baseUrl}/parts/${item.slug}\n`;
          }
          message += `\n`;
        });

        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📦 Total Items: ${items.reduce((s, i) => s + i.quantity, 0)}\n\n`;
        message += `📍 Destination Country: _________\n`;
        message += `📝 Additional Notes: _________\n\n`;
        message += `Please provide shipping quotes and availability. Thank you!`;

        return message;
      },

      getWhatsAppUrl: () => {
        const message = get().generateWhatsAppMessage();
        const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      },
    }),
    {
      name: "lowak-rfq-basket",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
