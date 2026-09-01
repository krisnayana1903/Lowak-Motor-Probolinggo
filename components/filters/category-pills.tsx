"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/catalog";

interface CategoryPillsProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryPills({ categories, activeCategory }: CategoryPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleCategoryClick = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryClick()}
        className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
          !activeCategory
            ? "border-amber-500 bg-amber-500 text-white"
            : "border-zinc-200 text-zinc-600 hover:border-amber-300 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-700"
        }`}
      >
        All Parts
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.slug)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
            activeCategory === cat.slug
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-amber-300 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-amber-700"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
