"use client";

/**
 * Barra superior.
 *
 * Muestra el título del módulo actual (derivado de la ruta) y el switch de
 * tema. Usa glass, heredado de los overrides de AppBar en el theme. En móvil
 * no lleva botón de menú porque la navegación va en la barra inferior.
 */

import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { navModules } from "@/config/navigation";
import { brand } from "@/theme/brand";
import { useThemeStore } from "@/store/ui/themeStore";

export function Topbar() {
  const pathname = usePathname();
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);

  // Título según la ruta actual; si no coincide, usamos el nombre del sistema.
  const current = navModules.find((m) => pathname.startsWith(m.path));
  const title = current?.label ?? brand.name;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{title}</Typography>
        <Box>
          <IconButton onClick={toggleMode} color="inherit" aria-label="cambiar tema">
            {mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
