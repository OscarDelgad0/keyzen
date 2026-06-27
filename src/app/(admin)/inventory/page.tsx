"use client";

/**
 * Pantalla principal de Inventario.
 *
 * Estructura: búsqueda global -> dropdown de categoría -> lista de productos
 * (cards) -> botón "+" flotante -> modal de crear.
 *
 * Lógica de filtrado acordada:
 *  - Si hay texto en la búsqueda: MANDA la búsqueda global (ignora el dropdown).
 *  - Si la búsqueda está vacía + dropdown en "Todas": muestra todos.
 *  - Si la búsqueda está vacía + una categoría elegida: filtra por categoría.
 * Así la búsqueda es una red de seguridad que nunca queda atrapada en una
 * categoría.
 *
 * Implementación: la búsqueda global ("/products?q=") con query vacío ya
 * devuelve todos, así que cubrimos "buscando" y "Todas" con el MISMO hook
 * (useProductSearch). La categoría concreta usa useProductsByCategory.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Fab,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductFormModal } from "@/components/ui/ProductFormModal";
import {
  useCategories,
  useProductsByCategory,
  useProductSearch,
  useCreateProduct,
} from "@/modules/inventory";
import type { CreateProductInput } from "@/modules/inventory/schemas";

/** Valor del dropdown para "todas las categorías". */
const ALL = "all";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>(ALL);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: categories } = useCategories();
  const create = useCreateProduct();

  // Hook de búsqueda: cubre tanto "buscando" como "Todas" (query vacío = todo).
  const searchHook = useProductSearch();
  // Hook por categoría: solo activo cuando hay una categoría concreta elegida
  // y NO se está buscando.
  const searching = search.trim().length > 0;
  const usingCategory = !searching && categoryId !== ALL;
  const byCategory = useProductsByCategory(usingCategory ? categoryId : null);

  // Dispara la búsqueda global: con debounce si hay texto, inmediata si es
  // "Todas" sin texto (query vacío).
  useEffect(() => {
    if (searching) {
      const id = setTimeout(() => searchHook.run(search.trim()), 250);
      return () => clearTimeout(id);
    }
    if (categoryId === ALL) {
      searchHook.run("");
    }
    // run/clear son estables (useCallback en el hook).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searching, categoryId]);

  // Mapa id -> nombre de categoría para las cards.
  const getCategoryName = useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((c) => map.set(c.id, c.name));
    return (id: string) => map.get(id) ?? "—";
  }, [categories]);

  // Fuente visible según el modo.
  const source = usingCategory ? byCategory : searchHook;
  const products = source.data ?? [];
  const loading = source.loading;
  const error = source.error;

  const handleSubmit = async (input: CreateProductInput): Promise<boolean> => {
    const created = await create.submit(input);
    if (!created) return false;
    // Refresca la vista actual tras crear.
    if (usingCategory) byCategory.refetch();
    else searchHook.run(searching ? search.trim() : "");
    return true;
  };

  const preselectedCategoryId = categoryId === ALL ? null : categoryId;

  return (
    <Box sx={{ position: "relative", pb: 10 }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
        Inventario
      </Typography>

      <TextField
        placeholder="Buscar producto…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 1.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Categoría"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        fullWidth
        size="small"
        disabled={searching}
        helperText={searching ? "Buscando en todo el inventario" : undefined}
        sx={{ mb: 2 }}
      >
        <MenuItem value={ALL}>Todas</MenuItem>
        {(categories ?? []).map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Typography color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && products.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          {searching
            ? "Sin resultados para tu búsqueda."
            : "No hay productos en esta categoría."}
        </Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={getCategoryName(p.categoryId)}
            />
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="Añadir producto"
        onClick={() => setModalOpen(true)}
        sx={{ position: "fixed", right: 24, bottom: 88 }}
      >
        <AddIcon />
      </Fab>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories ?? []}
        preselectedCategoryId={preselectedCategoryId}
        onSubmit={handleSubmit}
        saving={create.saving}
        error={create.error}
      />
    </Box>
  );
}
