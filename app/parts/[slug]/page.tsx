import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, Ruler, Weight, Tag, Layers, Bike } from "lucide-react";
import { getProductBySlug } from "@/lib/queries";
import { ImageGallery } from "@/components/product/image-gallery";
import { WhatsAppButton } from "@/components/product/whatsapp-button";
import { AddToRfqButton } from "@/components/product/add-to-rfq-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Part Not Found — Lowak Motor" };
  }
  return {
    title: `${product.title} — Lowak Motor`,
    description: `${product.condition} motorcycle part. Part #${product.part_number}. ${product.description || ""}`.trim(),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image Gallery */}
        <ImageGallery images={product.images} alt={product.title} />

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Category */}
          {product.category && (
            <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Layers className="h-3 w-3" />
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="mb-3 text-2xl font-extrabold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {product.title}
          </h1>

          {/* Badges Row */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900">
              <Tag className="h-3 w-3" />
              {product.part_number}
            </span>
            <span className="inline-flex items-center rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
              {product.condition}
            </span>
            {product.is_in_stock ? (
              <span className="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                ● In Stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-800 dark:bg-red-950/50 dark:text-red-400">
                ● Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-sm text-zinc-500">Reference Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                ${product.price_usd.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-zinc-400">USD</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {product.description}
              </p>
            </div>
          )}

          {/* Technical Specs */}
          <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Technical Specifications
            </h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Tag className="h-3.5 w-3.5" />
                  OEM Part Number
                </span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {product.part_number}
                </span>
              </div>
              {product.dimensions_metric && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Ruler className="h-3.5 w-3.5" />
                    Dimensions (Metric)
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.dimensions_metric}
                  </span>
                </div>
              )}
              {product.dimensions_imperial && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Ruler className="h-3.5 w-3.5" />
                    Dimensions (Imperial)
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.dimensions_imperial}
                  </span>
                </div>
              )}
              {product.weight_kg != null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Weight className="h-3.5 w-3.5" />
                    Weight
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {product.weight_kg} kg
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Box className="h-3.5 w-3.5" />
                  Condition
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {product.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <WhatsAppButton
              productTitle={product.title}
              partNumber={product.part_number}
              slug={product.slug}
              variant="primary"
            />
            <AddToRfqButton product={product} />
          </div>
        </div>
      </div>

      {/* Fitment Compatibility Table */}
      {product.fitments && product.fitments.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Bike className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Fitment Compatibility
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Make
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Model
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Years
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {product.fitments.map((fitment) => (
                  <tr
                    key={fitment.id}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {fitment.model.make.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {fitment.model.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {fitment.model.year_start}
                      {fitment.model.year_end
                        ? ` – ${fitment.model.year_end}`
                        : " – Present"}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500">
                      {fitment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
