import { supabase } from "./supabase";
import type {
  Make,
  Model,
  Category,
  Product,
  ProductWithDetails,
  CatalogFilters,
} from "@/types/catalog";

// ─── Makes ─────────────────────────────────────────────────────────

export async function getMakes(): Promise<Make[]> {
  const { data, error } = await supabase
    .from("makes")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching makes:", error);
    return [];
  }
  return data ?? [];
}

// ─── Models ────────────────────────────────────────────────────────

export async function getModelsByMake(makeId: number): Promise<Model[]> {
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .eq("make_id", makeId)
    .order("name");

  if (error) {
    console.error("Error fetching models:", error);
    return [];
  }
  return data ?? [];
}

// ─── Categories ────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data ?? [];
}

// ─── Products (with YMM + category filtering) ─────────────────────

export async function getProducts(
  filters?: CatalogFilters
): Promise<Product[]> {
  // If we have YMM filters, we need to join through product_fitments
  if (filters?.make || filters?.model || filters?.year) {
    return getProductsWithFitmentFilter(filters);
  }

  let query = supabase.from("products").select("*");

  if (filters?.category) {
    // Join through categories to filter by slug
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();

    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query.order("title");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data ?? [];
}

async function getProductsWithFitmentFilter(
  filters: CatalogFilters
): Promise<Product[]> {
  // Step 1: Find matching model IDs based on make/model/year
  let modelQuery = supabase.from("models").select("id, make_id, year_start, year_end");

  if (filters.model) {
    modelQuery = modelQuery.eq("id", Number(filters.model));
  } else if (filters.make) {
    modelQuery = modelQuery.eq("make_id", Number(filters.make));
  }

  const { data: models } = await modelQuery;
  if (!models || models.length === 0) return [];

  let filteredModelIds = models.map((m) => m.id);

  // Filter by year if specified
  if (filters.year) {
    const year = Number(filters.year);
    filteredModelIds = models
      .filter((m) => {
        const start = m.year_start;
        const end = m.year_end ?? new Date().getFullYear();
        return year >= start && year <= end;
      })
      .map((m) => m.id);
  }

  if (filteredModelIds.length === 0) return [];

  // Step 2: Get product IDs from fitments
  const { data: fitments } = await supabase
    .from("product_fitments")
    .select("product_id")
    .in("model_id", filteredModelIds);

  if (!fitments || fitments.length === 0) return [];

  const productIds = [...new Set(fitments.map((f) => f.product_id))];

  // Step 3: Fetch those products
  let productQuery = supabase.from("products").select("*").in("id", productIds);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();

    if (cat) {
      productQuery = productQuery.eq("category_id", cat.id);
    }
  }

  if (filters.search) {
    productQuery = productQuery.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await productQuery.order("title");

  if (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
  return data ?? [];
}

// ─── Single Product by Slug ────────────────────────────────────────

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  // Fetch the product
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    return null;
  }

  // Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", product.category_id)
    .single();

  // Fetch fitments with model and make data
  const { data: fitments } = await supabase
    .from("product_fitments")
    .select("*")
    .eq("product_id", product.id);

  // Enrich fitments with model + make data
  const enrichedFitments = [];
  if (fitments) {
    for (const fitment of fitments) {
      const { data: model } = await supabase
        .from("models")
        .select("*")
        .eq("id", fitment.model_id)
        .single();

      if (model) {
        const { data: make } = await supabase
          .from("makes")
          .select("*")
          .eq("id", model.make_id)
          .single();

        enrichedFitments.push({
          ...fitment,
          model: { ...model, make: make! },
        });
      }
    }
  }

  return {
    ...product,
    category: category ?? null,
    fitments: enrichedFitments,
  };
}
