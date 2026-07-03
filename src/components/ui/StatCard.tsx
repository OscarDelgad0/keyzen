"use client";

/**
 * Tarjeta de métrica (stat card).
 *
 * Muestra una etiqueta con ícono y un número grande. Acepta un color de
 * acento opcional para la barra izquierda y el ícono (para destacar métricas
 * accionables como bajo stock o agotados). Reutilizable en cualquier panel.
 */

import { Box, Card, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  /** Color de acento (CSS) para barra izquierda + ícono. Omitir = neutro. */
  accentColor?: string;
}

export function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: "background.paper",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mb: 0.75,
          color: accentColor ?? "text.secondary",
        }}
      >
        <Box sx={{ display: "flex", fontSize: 18 }}>{icon}</Box>
        <Typography variant="body2" sx={{ color: "inherit" }}>
          {label}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}>
        {value}
      </Typography>
    </Card>
  );
}
