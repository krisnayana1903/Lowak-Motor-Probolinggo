"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

const DEBOUNCE_MS = 400;

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Sync input value with URL param
  const urlSearch = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(urlSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input in sync if URL changes externally (e.g. back/forward navigation)
  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  // Debounced URL update
  useEffect(() => {
    // Don't trigger on initial mount if values already match
    if (inputValue === urlSearch) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (inputValue.trim()) {
        params.set("search", inputValue.trim());
      } else {
        params.delete("search");
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    setInputValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      {/* Search Icon / Spinner */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
        {isPending ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin text-amber-500" />
        ) : (
          <Search className="h-4.5 w-4.5 text-zinc-400" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by part name, part number, or keyword..."
        className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-10 text-sm font-medium text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        aria-label="Search parts catalog"
      />

      {/* Clear Button */}
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
