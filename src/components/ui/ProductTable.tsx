"use client";

/**
 * Tabla de productos (escritorio / tablet).
 *
 * Filas con barra de color a la izquierda según estado, chip de estado, e
 * inactivos atenuados. Lee los tonos de theme/brand.ts (mismos que las cards).
 * En tablet se reduce a menos columnas vía breakpoints de MUI.
 */

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  inventoryStatusTones,
  TABLE_BAR_OPACITY,
  TABLE_FADED_ROW_BG,
  TABLE_FADED_ROW_OPACITY,
} from "@/theme/brand";
import type { Product } from "@/modules/inventory/schemas";

const unitLabel: Record<Product["unit"], string> = {
  piece: "pz",
  pair: "par",
  meter: "m",
  set: "set",
};

interface ProductTableProps {
  products: Product[];
  getCategoryName: (categoryId: string) => string;
  onRowClick?: (product: Product) => void;
}

export function ProductTable({
  products,
  getCategoryName,
  onRowClick,
}: ProductTableProps) {
  return (
    <TableContainer
      sx={{
        borderRadius: 2,
        border: (t) => `1px solid ${t.palette.divider}`,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            {/* Categoría se oculta en pantallas pequeñas (tablet angosta). */}
            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
              Categoría
            </TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => {
            const tone = inventoryStatusTones[p.status];
            const faded = tone.faded;
            const price = new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              minimumFractionDigits: 0,
            }).format(p.price);

            return (
              <TableRow
                key={p.id}
                hover
                onClick={onRowClick ? () => onRowClick(p) : undefined}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  backgroundColor: faded ? TABLE_FADED_ROW_BG : "transparent",
                  opacity: faded ? TABLE_FADED_ROW_OPACITY : 1,
                  // Barra de color a la izquierda (estado).
                  borderLeft: `3px solid rgba(${tone.baseRgb}, ${TABLE_BAR_OPACITY})`,
                }}
              >
                <TableCell>
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    {p.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography variant="body2" color="text.secondary">
                    {getCategoryName(p.categoryId)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {p.stock} {unitLabel[p.unit]}
                </TableCell>
                <TableCell>
                  <StatusChip status={p.status} />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ fontWeight: 500 }}>{price}</Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
