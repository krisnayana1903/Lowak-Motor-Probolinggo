import { Suspense } from "react";
import { Bike, Shield, Globe, Headphones } from "lucide-react";
import { getProducts, getCategories } from "@/lib/queries";
import { YmmFilter } from "@/components/filters/ymm-filter";
import { SearchBar } from "@/components/filters/search-bar";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductSkeletonGrid } from "@/components/catalog/product-skeleton";
import { CategoryPills } from "@/components/filters/category-pills";
import type { CatalogFilters } from "@/types/catalog";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function CatalogResults({ filters }: { filters: CatalogFilters }) {
  const products = await getProducts(filters);

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {products.length}
          </span>{" "}
          part{products.length !== 1 ? "s" : ""} found
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  const filters: CatalogFilters = {
    make: resolvedParams.make as string | undefined,
    model: resolvedParams.model as string | undefined,
    year: resolvedParams.year as string | undefined,
    category: resolvedParams.category as string | undefined,
    search: resolvedParams.search as string | undefined,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-8 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
              <Bike className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              International Catalog
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Motorcycle Spare Parts
            <span className="block text-amber-400">Worldwide Delivery</span>
          </h1>
          <p className="max-w-xl text-base text-zinc-400 sm:text-lg">
            Browse our extensive inventory of OEM and aftermarket parts. Find the
            exact part you need, then request a quote directly via WhatsApp.
          </p>

          {/* Value Props */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Shield, label: "Genuine OEM Parts" },
              { icon: Globe, label: "Ship Worldwide" },
              { icon: Headphones, label: "Expert Support" },
              { icon: Bike, label: "All Major Brands" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 flex-shrink-0 text-amber-400" />
                <span className="text-xs font-medium text-zinc-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="mb-6">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section id="categories" className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Browse by Category
          </h2>
          <Suspense fallback={null}>
            <CategoryPills
              categories={categories}
              activeCategory={filters.category}
            />
          </Suspense>
        </section>
      )}

      {/* YMM Filter */}
      <section className="mb-8">
        <Suspense fallback={null}>
          <YmmFilter />
        </Suspense>
      </section>

      {/* Product Grid */}
      <section>
        <Suspense fallback={<ProductSkeletonGrid />}>
          <CatalogResults filters={filters} />
        </Suspense>
      </section>
    </div>
  );
}
