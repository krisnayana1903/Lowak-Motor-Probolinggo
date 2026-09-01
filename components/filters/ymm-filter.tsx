"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, RotateCcw, Search, Loader2 } from "lucide-react";
import type { Make, Model } from "@/types/catalog";

export function YmmFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  const selectedMake = searchParams.get("make") || "";
  const selectedModel = searchParams.get("model") || "";
  const selectedYear = searchParams.get("year") || "";

  // Fetch makes on mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        const res = await fetch("/api/makes");
        const data = await res.json();
        setMakes(data);
      } catch (err) {
        console.error("Failed to fetch makes:", err);
      } finally {
        setLoadingMakes(false);
      }
    }
    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setYears([]);
      return;
    }
    async function fetchModels() {
      setLoadingModels(true);
      try {
        const res = await fetch(`/api/models?make_id=${selectedMake}`);
        const data = await res.json();
        setModels(data);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoadingModels(false);
      }
    }
    fetchModels();
  }, [selectedMake]);

  // Derive year range when model changes
  useEffect(() => {
    if (!selectedModel) {
      // If we have models, show all years across all models
      if (models.length > 0) {
        const allYears = new Set<number>();
        models.forEach((m) => {
          const end = m.year_end ?? new Date().getFullYear();
          for (let y = m.year_start; y <= end; y++) {
            allYears.add(y);
          }
        });
        setYears(Array.from(allYears).sort((a, b) => b - a));
      } else {
        setYears([]);
      }
      return;
    }
    const model = models.find((m) => m.id === Number(selectedModel));
    if (model) {
      const end = model.year_end ?? new Date().getFullYear();
      const yearList: number[] = [];
      for (let y = model.year_start; y <= end; y++) {
        yearList.push(y);
      }
      setYears(yearList.sort((a, b) => b - a));
    }
  }, [selectedModel, models]);

  const updateParams = useCallback(
    (key: string, value: string, clearKeys?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (clearKeys) {
        clearKeys.forEach((k) => params.delete(k));
      }
      const newUrl = `/?${params.toString()}`;
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const resetFilters = () => {
    startTransition(() => {
      router.replace("/", { scroll: false });
    });
  };

  const hasActiveFilters = selectedMake || selectedModel || selectedYear;

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          ) : (
            <Search className="h-4 w-4 text-zinc-400" />
          )}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Find Parts by Vehicle
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Make Select */}
        <div className="relative">
          <select
            value={selectedMake}
            onChange={(e) =>
              updateParams("make", e.target.value, ["model", "year"])
            }
            disabled={loadingMakes}
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm font-medium text-zinc-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">
              {loadingMakes ? "Loading..." : "All Makes"}
            </option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Model Select */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => updateParams("model", e.target.value, ["year"])}
            disabled={!selectedMake || loadingModels}
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm font-medium text-zinc-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">
              {loadingModels ? "Loading..." : "All Models"}
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Year Select */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => updateParams("year", e.target.value)}
            disabled={!selectedMake}
            className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm font-medium text-zinc-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>
    </div>
  );
}
