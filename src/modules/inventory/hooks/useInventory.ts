"use client";
import { useCallback, useEffect, useState } from "react";
import type { ApiResult } from "@/core/api";
import { getCategories, getProductsByCategory, searchProducts, createProduct, getInventorySummary } from "@/modules/inventory/services";
import type { Category, Product, ProductPage, InventorySummary, CreateProductInput } from "@/modules/inventory/schemas";

const PAGE_SIZE = 20;

interface AsyncState<T> { data: T | null; loading: boolean; error: string | null; }
function applyResult<T>(r: ApiResult<T>, set: React.Dispatch<React.SetStateAction<AsyncState<T>>>) {
  if (r.ok) set({ data: r.data, loading: false, error: null });
  else set({ data: null, loading: false, error: r.error.message });
}

/** Estado común de un listado paginado de productos. */
interface PagedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useCategories() {
  const [s, set] = useState<AsyncState<Category[]>>({ data: null, loading: true, error: null });
  const load = useCallback(async () => { set((p) => ({ ...p, loading: true, error: null })); applyResult(await getCategories(), set); }, []);
  useEffect(() => { load(); }, [load]);
  return { ...s, refetch: load };
}

/** Productos de una categoría, paginados. `categoryId` null = inactivo. */
export function useProductsByCategory(categoryId: string | null): PagedProducts {
  const [page, setPage] = useState(1);
  const [s, set] = useState<AsyncState<ProductPage>>({ data: null, loading: Boolean(categoryId), error: null });

  // Al cambiar de categoría, volvemos a la página 1.
  useEffect(() => { setPage(1); }, [categoryId]);

  const load = useCallback(async () => {
    if (!categoryId) { set({ data: null, loading: false, error: null }); return; }
    set((p) => ({ ...p, loading: true, error: null }));
    applyResult(await getProductsByCategory(categoryId, { page, pageSize: PAGE_SIZE }), set);
  }, [categoryId, page]);
  useEffect(() => { load(); }, [load]);

  return {
    items: s.data?.items ?? [],
    total: s.data?.total ?? 0,
    page,
    pageSize: PAGE_SIZE,
    loading: s.loading,
    error: s.error,
    setPage,
    refetch: load,
  };
}

/** Búsqueda global (y "Todas" con query vacío), paginada. */
export function useProductSearch(): PagedProducts & { run: (q: string) => void; clear: () => void } {
  const [query, setQuery] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [s, set] = useState<AsyncState<ProductPage>>({ data: null, loading: false, error: null });

  const load = useCallback(async () => {
    if (query === null) { set({ data: null, loading: false, error: null }); return; }
    set((p) => ({ ...p, loading: true, error: null }));
    applyResult(await searchProducts(query, { page, pageSize: PAGE_SIZE }), set);
  }, [query, page]);
  useEffect(() => { load(); }, [load]);

  const run = useCallback((q: string) => { setPage(1); setQuery(q); }, []);
  const clear = useCallback(() => { setQuery(null); set({ data: null, loading: false, error: null }); }, []);

  return {
    items: s.data?.items ?? [],
    total: s.data?.total ?? 0,
    page,
    pageSize: PAGE_SIZE,
    loading: s.loading,
    error: s.error,
    setPage,
    refetch: load,
    run,
    clear,
  };
}

export function useCreateProduct() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setSaving(true); setError(null);
    const r = await createProduct(input);
    setSaving(false);
    if (r.ok) return r.data;
    setError(r.error.message); return null;
  }, []);
  return { submit, saving, error };
}

/** Resumen para las stat cards. Expone refetch para recalcular tras cambios. */
export function useInventorySummary() {
  const [s, set] = useState<AsyncState<InventorySummary>>({ data: null, loading: true, error: null });
  const load = useCallback(async () => { set((p) => ({ ...p, loading: true, error: null })); applyResult(await getInventorySummary(), set); }, []);
  useEffect(() => { load(); }, [load]);
  return { ...s, refetch: load };
}
