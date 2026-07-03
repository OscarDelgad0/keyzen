import { apiFetch, type ApiResult } from "@/core/api";
import { categoryListSchema, productPageSchema, productSchema, createProductSchema, inventorySummarySchema, type Category, type Product, type ProductPage, type InventorySummary, type CreateProductInput } from "@/modules/inventory/schemas";
import "@/modules/inventory/mocks/inventory.mocks";

/** Parámetros de paginación comunes. */
export interface PageParams { page: number; pageSize: number; }
const DEFAULT_PAGE_SIZE = 20;

function pageQuery(p?: Partial<PageParams>): string {
  const page = p?.page ?? 1;
  const pageSize = p?.pageSize ?? DEFAULT_PAGE_SIZE;
  return `page=${page}&pageSize=${pageSize}`;
}

export function getCategories(): Promise<ApiResult<Category[]>> {
  return apiFetch({ path: "/categories", method: "GET", responseSchema: categoryListSchema });
}

export function getProductsByCategory(id: string, p?: Partial<PageParams>): Promise<ApiResult<ProductPage>> {
  return apiFetch({ path: `/categories/${encodeURIComponent(id)}/products?${pageQuery(p)}`, method: "GET", responseSchema: productPageSchema });
}

export function searchProducts(q: string, p?: Partial<PageParams>): Promise<ApiResult<ProductPage>> {
  return apiFetch({ path: `/products?q=${encodeURIComponent(q)}&${pageQuery(p)}`, method: "GET", responseSchema: productPageSchema });
}

export function createProduct(input: CreateProductInput): Promise<ApiResult<Product>> {
  return apiFetch({ path: "/products", method: "POST", body: input, requestSchema: createProductSchema, responseSchema: productSchema });
}

export function getInventorySummary(): Promise<ApiResult<InventorySummary>> {
  return apiFetch({ path: "/inventory/summary", method: "GET", responseSchema: inventorySummarySchema });
}
