"use client";

/**
 * Barra de navegación inferior (móvil).
 *
 * Muestra los módulos más usados (los marcados con inBottomNav) más un botón
 * "Más" que abre la hoja con el resto. Acceso de un toque al pulgar.
 */

import { usePathname, useRouter } from "next/navigation";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { bottomNavModules } from "@/config/navigation";
import { useNavStore } from "@/store/ui/navStore";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const openMore = useNavStore((s) => s.openMore);

  // Valor activo: la ruta actual si es uno de los módulos de la barra.
  const activePath =
    bottomNavModules.find((m) => pathname.startsWith(m.path))?.path ?? false;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <BottomNavigation
        showLabels
        value={activePath}
        sx={{ bgcolor: "transparent" }}
      >
        {bottomNavModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <BottomNavigationAction
              key={mod.key}
              label={mod.label}
              value={mod.path}
              icon={<Icon />}
              onClick={() => router.push(mod.path)}
            />
          );
        })}
        <BottomNavigationAction
          label="Más"
          value="more"
          icon={<MoreHorizIcon />}
          onClick={openMore}
        />
      </BottomNavigation>
    </Paper>
  );
}
