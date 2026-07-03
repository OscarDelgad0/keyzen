"use client";

/**
 * Pantalla de Inventario.
 *
 * Cabecera (título + botón "Nuevo producto" en escritorio) -> fila de stat
 * cards (resumen real desde /inventory/summary) -> panel con la colección
 * (búsqueda, filtro, toggle, tabla/cards, paginación).
 *
 * El botón de crear va en la cabecera en escritorio; en móvil se usa el FAB.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ProductCollection } from "@/components/ui/ProductCollection";
import { ProductFormModal } from "@/components/ui/ProductFormModal";
import {
  useCategories,
  useProductsByCategory,
  useProductSearch,
  useCreateProduct,
  useInventorySummary,
} from "@/modules/inventory/hooks";
import type { CreateProductInput } from "@/modules/inventory/schemas";
import { useTenantConfig } from "@/modules/tenant/hooks";
import type { ListView } from "@/modules/tenant/schemas";
import { inventoryStatusTones } from "@/theme/brand";

const ALL = "all";

/** Formatea pesos sin decimales. */
const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

export default function InventoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { config } = useTenantConfig();
  const tenantDefaultView: ListView = config?.ui.inventory.defaultView ?? "table";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>(ALL);
  const [modalOpen, setModalOpen] = useState(false);
  const [userView, setUserView] = useState<ListView | null>(null);

  const view: ListView = isMobile ? "cards" : userView ?? tenantDefaultView;

  const { data: categories } = useCategories();
  const create = useCreateProduct();
  const summary = useInventorySummary();

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
    } else {
      searchHook.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searching, categoryId]);

  const getCategoryName = useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((c) => map.set(c.id, c.name));
    return (id: string) => map.get(id) ?? "—";
  }, [categories]);

  const source = usingCategory ? byCategory : searchHook;
  const pageCount = Math.max(1, Math.ceil(source.total / source.pageSize));

  const handleSubmit = async (input: CreateProductInput): Promise<boolean> => {
    const created = await create.submit(input);
    if (!created) return false;
    source.refetch();
    summary.refetch(); // los totales cambian al crear
    return true;
  };

  const preselectedCategoryId = categoryId === ALL ? null : categoryId;

  const s = summary.data;
  const dash = "—";

  return (
    <Box sx={{ position: "relative", pb: 10 }}>
      <PageHeader
        title="Inventario"
        action={
          !isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
            >
              Nuevo producto
            </Button>
          )
        }
      />

      {/* Stat cards */}
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          mb: 2.5,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        <StatCard
          label="Productos"
          value={s ? s.totalProducts : dash}
          icon={<Inventory2OutlinedIcon fontSize="inherit" />}
        />
        <StatCard
          label="Bajo stock"
          value={s ? s.lowStockCount : dash}
          icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
          accentColor={`rgb(${inventoryStatusTones.lowStock.baseRgb})`}
        />
        <StatCard
          label="Agotados"
          value={s ? s.outOfStockCount : dash}
          icon={<HighlightOffOutlinedIcon fontSize="inherit" />}
          accentColor={`rgb(${inventoryStatusTones.outOfStock.baseRgb})`}
        />
        <StatCard
          label="Valor inventario"
          value={s ? money(s.inventoryValue) : dash}
          icon={<PaidOutlinedIcon fontSize="inherit" />}
        />
      </Box>

      <ProductCollection
        products={source.items}
        categories={categories ?? []}
        getCategoryName={getCategoryName}
        loading={source.loading}
        error={source.error}
        page={source.page}
        pageCount={pageCount}
        onPageChange={(p) => source.setPage(p)}
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        allValue={ALL}
        view={view}
        onViewChange={(v) => setUserView(v)}
        showViewToggle={!isMobile}
      />

      {/* FAB solo en móvil */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="Añadir producto"
          onClick={() => setModalOpen(true)}
          sx={{ position: "fixed", right: 24, bottom: 88 }}
        >
          <AddIcon />
        </Fab>
      )}

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
