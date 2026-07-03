"use client";

/**
 * Cabecera de página: título a la izquierda y una acción opcional a la
 * derecha (ej. botón "Nuevo producto"). Reutilizable en todos los módulos.
 * La acción es libre (children del lado derecho) para no acoplarla.
 */

import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 2.5,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      {action}
    </Box>
  );
}
