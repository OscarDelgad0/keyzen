"use client";

/**
 * Tarjeta de producto (vista de cards) — diseño con ícono de categoría.
 *
 * Estructura: ícono de la categoría a la izquierda, nombre + categoría/stock
 * en medio, y abajo el chip de estado con el precio. El nombre y la clave de
 * ícono de la categoría se resuelven fuera (la card recibe ambos ya listos)
 * para no acoplarla al catálogo.
 */

import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Product } from "@/modules/inventory/schemas";

const unitLabel: Record<Product["unit"], string> = {
  piece: "pz",
  pair: "par",
  meter: "m",
  set: "set",
};

interface ProductCardProps {
  product: Product;
  /** Nombre de la categoría ya resuelto. */
  categoryName: string;
  /** Clave de ícono de la categoría (campo `icon`). */
  categoryIconKey?: string;
  onClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  categoryName,
  categoryIconKey,
  onClick,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(product.price);

  const faded = product.status === "inactive";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        backgroundColor: "background.paper",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        opacity: faded ? 0.7 : 1,
      }}
    >
      <CardActionArea
        onClick={onClick ? () => onClick(product) : undefined}
        sx={{ p: 1.75 }}
      >
        {/* Fila superior: ícono + nombre/categoría */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
              color: "primary.main",
            }}
          >
            <CategoryIcon iconKey={categoryIconKey} fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}
              noWrap
            >
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {categoryName} · {product.stock} {unitLabel[product.unit]}
            </Typography>
          </Box>
        </Box>

        {/* Fila inferior: estado + precio */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          <StatusChip status={product.status} />
          <Typography sx={{ fontWeight: 500, fontSize: 17 }}>
            {formattedPrice}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
