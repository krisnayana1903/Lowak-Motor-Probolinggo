"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productTitle: string;
  partNumber: string;
  slug: string;
  variant?: "primary" | "secondary";
}

export function WhatsAppButton({
  productTitle,
  partNumber,
  slug,
  variant = "primary",
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${baseUrl}/parts/${slug}`;

    const message = [
      `👋 Hello! I'm interested in a part from your catalog:`,
      ``,
      `🔧 *${productTitle}*`,
      `📋 Part #: ${partNumber}`,
      `🔗 ${productUrl}`,
      ``,
      `📍 My destination country: _________`,
      `📦 Desired quantity: _________`,
      ``,
      `Could you please provide pricing and shipping information? Thank you!`,
    ].join("\n");

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" />
        Inquire via WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </button>
  );
}
