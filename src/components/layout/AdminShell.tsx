"use client";

/**
 * Armazón administrativo.
 *
 * Decide qué navegación mostrar según el ancho de pantalla:
 *  - móvil (xs–sm): barra inferior híbrida + hoja "Más"
 *  - tablet y escritorio (md+): sidebar colapsable
 *
 * El contenido de cada módulo se renderiza en el área principal.
 * En tablet, el sidebar arranca colapsado (se ajusta al montar).
 */

import { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MoreSheet } from "@/components/layout/MoreSheet";
import { useNavStore } from "@/store/ui/navStore";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  // A partir de "md" (>=900px) mostramos sidebar; debajo, barra inferior.
  const showSidebar = useMediaQuery(theme.breakpoints.up("md"));
  // En tablet (md–lg) arrancamos con el sidebar colapsado.
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const setSidebarCollapsed = useNavStore((s) => s.setSidebarCollapsed);

  useEffect(() => {
    if (isTablet) setSidebarCollapsed(true);
  }, [isTablet, setSidebarCollapsed]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {showSidebar && <Sidebar />}

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            // Espacio para que la barra inferior no tape el contenido en móvil.
            pb: { xs: 10, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Navegación de móvil */}
      {!showSidebar && (
        <>
          <BottomNav />
          <MoreSheet />
        </>
      )}
    </Box>
  );
}
