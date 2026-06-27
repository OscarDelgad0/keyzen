"use client";

/**
 * Pantalla principal de Inventario.
 *
 * Estructura: búsqueda global -> dropdown de categoría + toggle de vista ->
 * lista (tabla o cards) -> botón "+" flotante -> modal de crear.
 *
 * Filtrado acordado:
 *  - Con texto en la búsqueda: MANDA la búsqueda global (ignora el dropdown).
 *  - Sin texto + "Todas": todos. Sin texto + categoría: filtra por categoría.
 *
 * Vista (tabla/cards):
 *  - El DEFAULT lo da la config del tenant (ui.inventory.defaultView).
 *  - El usuario puede cambiarlo con el toggle, pero solo durante la sesión
 *    (no se persiste; al recargar vuelve al default del tenant).
 *  - En móvil se fuerzan cards y el toggle se oculta (la tabla no cabe bien).
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductTable } from "@/components/ui/ProductTable";
import { ProductFormModal } from "@/components/ui/ProductFormModal";
import { ViewToggle } from "@/components/ui/ViewToggle";
import {
  useCategories,
  useProductsByCategory,
  useProductSearch,
  useCreateProduct,
} from "@/modules/inventory/hooks";
import type { CreateProductInput } from "@/modules/inventory/schemas";
import { useTenantConfig } from "@/modules/tenant/hooks";
import type { ListView } from "@/modules/tenant/schemas";

/** Valor del dropdown para "todas las categorías". */
const ALL = "all";

export default function InventoryPage() {
  const theme = useTheme();
  // Móvil = por debajo de "md". Ahí se fuerzan cards y se oculta el toggle.
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { config } = useTenantConfig();
  const tenantDefaultView: ListView = config?.ui.inventory.defaultView ?? "table";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>(ALL);
  const [modalOpen, setModalOpen] = useState(false);

  // Vista elegida por el usuario en la sesión. null = aún usa el default tenant.
  const [userView, setUserView] = useState<ListView | null>(null);
  // Vista efectiva: en móvil siempre cards; si no, la del usuario o el default.
  const view: ListView = isMobile ? "cards" : userView ?? tenantDefaultView;

  const { data: categories } = useCategories();
  const create = useCreateProduct();

  const searchHook = useProductSearch();
  const searching = search.trim().length > 0;
  const usingCategory = !searching && categoryId !== ALL;
  const byCategory = useProductsByCategory(usingCategory ? categoryId : null);

  useEffect(() => {
    if (searching) {
      const id = setTimeout(() => searchHook.run(search.trim()), 250);
      return () => clearTimeout(id);
    }
    if (categoryId === ALL) {
      searchHook.run("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searching, categoryId]);

  const getCategoryName = useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((c) => map.set(c.id, c.name));
    return (id: string) => map.get(id) ?? "—";
  }, [categories]);

  const source = usingCategory ? byCategory : searchHook;
  const products = source.data ?? [];
  const loading = source.loading;
  const error = source.error;

  const handleSubmit = async (input: CreateProductInput): Promise<boolean> => {
    const created = await create.submit(input);
    if (!created) return false;
    if (usingCategory) byCategory.refetch();
    else searchHook.run(searching ? search.trim() : "");
    return true;
  };

  const preselectedCategoryId = categoryId === ALL ? null : categoryId;

  return (
    <Box sx={{ position: "relative", pb: 10, maxWidth: 1100, mx: "auto" }}>
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          select
          label="Categoría"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          size="small"
          disabled={searching}
          helperText={searching ? "Buscando en todo el inventario" : undefined}
          sx={{ flex: 1 }}
        >
          <MenuItem value={ALL}>Todas</MenuItem>
          {(categories ?? []).map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        {/* El toggle solo aparece en escritorio/tablet. */}
        {!isMobile && (
          <ViewToggle value={view} onChange={(v) => setUserView(v)} />
        )}
      </Box>

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
        <>
          {view === "table" ? (
            <ProductTable
              products={products}
              getCategoryName={getCategoryName}
            />
          ) : (
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
        </>
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
