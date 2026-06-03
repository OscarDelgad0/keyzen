"use client";

/**
 * Hoja "Más" (móvil).
 *
 * Drawer que sube desde abajo con los módulos que no caben en la barra
 * inferior. Se abre desde el botón "Más" y se cierra al elegir un módulo
 * o tocar fuera.
 */

import { usePathname, useRouter } from "next/navigation";
import {
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { moreModules } from "@/config/navigation";
import { useNavStore } from "@/store/ui/navStore";

export function MoreSheet() {
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = useNavStore((s) => s.isMoreOpen);
  const openMore = useNavStore((s) => s.openMore);
  const closeMore = useNavStore((s) => s.closeMore);

  const goTo = (path: string) => {
    router.push(path);
    closeMore();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onClose={closeMore}
      onOpen={openMore}
      disableSwipeToOpen
      PaperProps={{
        sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 2 },
      }}
    >
      {/* Asa visual de la hoja */}
      <Box
        sx={{
          width: 36,
          height: 4,
          bgcolor: "divider",
          borderRadius: 2,
          mx: "auto",
          mt: 1,
          mb: 1,
        }}
      />
      <List>
        {moreModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = pathname.startsWith(mod.path);
          return (
            <ListItemButton
              key={mod.key}
              selected={isActive}
              onClick={() => goTo(mod.path)}
            >
              <ListItemIcon sx={{ color: "text.secondary" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={mod.label} />
            </ListItemButton>
          );
        })}
      </List>
    </SwipeableDrawer>
  );
}
