// ─── Database Row Types ────────────────────────────────────────────

export interface Make {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  make_id: number;
  name: string;
  year_start: number;
  year_end: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type ProductCondition =
  | "Brand New OEM"
  | "Brand New Aftermarket"
  | "Refurbished"
  | "Used - Grade A"
  | "Used - Grade B";

export interface Product {
  id: number;
  title: string;
  slug: string;
  part_number: string;
  category_id: number;
  condition: ProductCondition | string;
  price_usd: number;
  description: string | null;
  dimensions_metric: string | null;
  dimensions_imperial: string | null;
  weight_kg: number | null;
  images: string[];
  is_in_stock: boolean;
}

export interface ProductFitment {
  id: number;
  product_id: number;
  model_id: number;
  notes: string | null;
}

// ─── Joined / Enriched Types ───────────────────────────────────────

export interface ProductFitmentWithModel extends ProductFitment {
  model: Model & { make: Make };
}

export interface ProductWithDetails extends Product {
  category: Category | null;
  fitments: ProductFitmentWithModel[];
}

// ─── RFQ Basket Types ──────────────────────────────────────────────

export interface RfqItem {
  id: number;
  title: string;
  slug: string;
  part_number: string;
  price_usd: number;
  condition: string;
  image: string | null;
  quantity: number;
}

// ─── Filter Types ──────────────────────────────────────────────────

export interface CatalogFilters {
  make?: string;
  model?: string;
  year?: string;
  category?: string;
  search?: string;
}
