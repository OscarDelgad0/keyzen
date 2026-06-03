"use client";

/**
 * Barra lateral de navegación (escritorio y tablet).
 *
 * Colapsable: expandida muestra los nombres, colapsada solo íconos con
 * tooltip. Lee los módulos de la lista única y resalta el activo según la
 * ruta actual. La preferencia de colapso vive en el store de navegación.
 */

import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { navModules } from "@/config/navigation";
import { brand } from "@/theme/brand";
import { useNavStore } from "@/store/ui/navStore";

const EXPANDED_WIDTH = 224;
const COLLAPSED_WIDTH = 64;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isCollapsed = useNavStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useNavStore((s) => s.toggleSidebar);

  const width = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        transition: "width 0.26s ease",
        borderRight: 1,
        borderColor: "divider",
        // Glass: heredado de los overrides del theme para superficies.
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Encabezado con logo y botón de colapso */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: isCollapsed ? 0 : 2,
          justifyContent: isCollapsed ? "center" : "flex-start",
          height: 56,
          color: "primary.main",
        }}
      >
        <VpnKeyOutlinedIcon />
        {!isCollapsed && (
          <Box sx={{ fontWeight: 600, flexGrow: 1 }}>{brand.name}</Box>
        )}
        {!isCollapsed && (
          <IconButton size="small" onClick={toggleSidebar} aria-label="colapsar menú">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Botón para expandir cuando está colapsado */}
      {isCollapsed && (
        <IconButton
          size="small"
          onClick={toggleSidebar}
          aria-label="expandir menú"
          sx={{ alignSelf: "center", mb: 1 }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}

      {/* Lista de módulos */}
      <List sx={{ px: isCollapsed ? 0.5 : 1, flexGrow: 1 }}>
        {navModules.map((mod) => {
          // El route group (admin) no aparece en la URL, así que comparamos
          // directamente contra la ruta del módulo.
          const isActive = pathname.startsWith(mod.path);
          const Icon = mod.icon;
          const button = (
            <ListItemButton
              key={mod.key}
              selected={isActive}
              onClick={() => router.push(mod.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1 : 2,
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: "center",
                  color: "text.secondary",
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={mod.label} />}
            </ListItemButton>
          );

          // Al colapsar, mostramos el nombre como tooltip.
          return isCollapsed ? (
            <Tooltip key={mod.key} title={mod.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </List>
    </Box>
  );
}
