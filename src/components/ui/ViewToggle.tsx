"use client";

/**
 * Toggle de vista: tabla o tarjetas.
 *
 * Control compacto de dos botones. El padre decide cuándo mostrarlo (en móvil
 * se oculta y se fuerzan cards). No guarda estado: es controlado por props.
 */

import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import type { ListView } from "@/modules/tenant/schemas";

interface ViewToggleProps {
  value: ListView;
  onChange: (view: ListView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={(_, next: ListView | null) => {
        // exclusive devuelve null si se vuelve a pulsar el activo: lo ignoramos.
        if (next) onChange(next);
      }}
    >
      <ToggleButton value="table" aria-label="Vista de tabla">
        <Tooltip title="Tabla">
          <ViewListIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="cards" aria-label="Vista de tarjetas">
        <Tooltip title="Tarjetas">
          <ViewModuleIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
