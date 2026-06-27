"use client";

/**
 * Chip de estado de producto (activo / bajo stock / agotado / inactivo).
 *
 * Lee los tonos desde theme/brand.ts (inventoryStatusTones), así que el color
 * es el mismo que usará la tabla. No define colores propios.
 */

import { Chip } from "@mui/material";
import {
  inventoryStatusTones,
  TABLE_CHIP_OPACITY,
  type StatusKey,
} from "@/theme/brand";

interface StatusChipProps {
  status: StatusKey;
}

export function StatusChip({ status }: StatusChipProps) {
  const tone = inventoryStatusTones[status];
  return (
    <Chip
      label={tone.label}
      size="small"
      sx={{
        height: 22,
        fontSize: 12,
        fontWeight: 500,
        color: tone.chipText,
        backgroundColor: `rgba(${tone.baseRgb}, ${TABLE_CHIP_OPACITY})`,
        borderRadius: 1,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}
