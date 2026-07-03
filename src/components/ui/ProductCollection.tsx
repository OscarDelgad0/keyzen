"use client";

/**
 * Colección de productos: la "tabla con todo incluido".
 *
 * Encapsula en un panel blanco: barra superior (búsqueda + dropdown de
 * categoría + toggle de vista), cuerpo (tabla o grid de cards) y paginación.
 * Es controlado: recibe datos y callbacks; no llama servicios. Así la página
 * solo orquesta los hooks y este componente se reutiliza en otros módulos.
 *
 * Vista: tabla o cards (auto-fill) según `view`. En móvil el padre fuerza
 * "cards" y oculta el toggle.
 */

import {
  Box,
  Card,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductTable } from "@/components/ui/ProductTable";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { Category, Product } from "@/modules/inventory/schemas";
import type { ListView } from "@/modules/tenant/schemas";

interface ProductCollectionProps {
  // Datos
  products: Product[];
  categories: Category[];
  getCategoryName: (categoryId: string) => string;
  loading: boolean;
  error: string | null;
  // Paginación
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  // Búsqueda
  search: string;
  onSearchChange: (value: string) => void;
  // Filtro de categoría
  categoryId: string;
  onCategoryChange: (value: string) => void;
  allValue: string;
  // Vista
  view: ListView;
  onViewChange: (view: ListView) => void;
  showViewToggle: boolean;
}

export function ProductCollection({
  products,
  categories,
  getCategoryName,
  loading,
  error,
  page,
  pageCount,
  onPageChange,
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  allValue,
  view,
  onViewChange,
  showViewToggle,
}: ProductCollectionProps) {
  const searching = search.trim().length > 0;

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        backgroundColor: "background.paper",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
    >
      {/* Barra superior */}
      <TextField
        placeholder="Buscar producto…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <TextField
          select
          label="Categoría"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          size="small"
          disabled={searching}
          helperText={searching ? "Buscando en todo el inventario" : undefined}
          sx={{ flex: 1 }}
        >
          <MenuItem value={allValue}>Todas</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        {showViewToggle && <ViewToggle value={view} onChange={onViewChange} />}
      </Box>

      {/* Cuerpo */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Typography color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && products.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 5, textAlign: "center" }}>
          {searching
            ? "Sin resultados para tu búsqueda."
            : "No hay productos en esta categoría."}
        </Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {view === "table" ? (
            <ProductTable products={products} getCategoryName={getCategoryName} />
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={getCategoryName(p.categoryId)}
                  categoryIconKey={
                    categories.find((c) => c.id === p.categoryId)?.icon
                  }
                />
              ))}
            </Box>
          )}

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, p) => onPageChange(p)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </>
      )}
    </Card>
  );
}
