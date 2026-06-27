"use client";

/**
 * Tarjeta de producto para la lista de Inventario (móvil).
 *
 * Muestra nombre, categoría, stock, precio y el chip de estado.
 * El nombre de la categoría se resuelve fuera (la card recibe el texto ya
 * listo) para no acoplarla al catálogo de categorías.
 */

import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import type { Product } from "@/modules/inventory/schemas";

/** Texto corto de la unidad para mostrar junto al stock. */
const unitLabel: Record<Product["unit"], string> = {
  piece: "pz",
  pair: "par",
  meter: "m",
  set: "set",
};

interface ProductCardProps {
  product: Product;
  /** Nombre de la categoría ya resuelto (para mostrarlo). */
  categoryName: string;
  /** Acción al tocar la tarjeta (editar, ver detalle...). Opcional. */
  onClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  categoryName,
  onClick,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardActionArea
        onClick={onClick ? () => onClick(product) : undefined}
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}
            noWrap
          >
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25 }}
            noWrap
          >
            {categoryName} · {product.stock} {unitLabel[product.unit]}
          </Typography>
          <Box sx={{ mt: 0.75 }}>
            <StatusChip status={product.status} />
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 500, fontSize: 15, whiteSpace: "nowrap" }}>
          {formattedPrice}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
