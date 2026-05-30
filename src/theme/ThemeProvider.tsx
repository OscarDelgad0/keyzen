"use client";

/**
 * Provider de theme de la aplicación.
 *
 * Integra MUI con el App Router de Next (AppRouterCacheProvider de Emotion,
 * para que no parpadeen los estilos al cargar) y aplica el theme claro u
 * oscuro según el modo guardado en el store.
 *
 * Nota sobre hidratación: el modo persistido vive en localStorage y solo
 * existe en el cliente. Para evitar un desajuste entre servidor y cliente,
 * en el primer render usamos siempre el theme claro y, una vez montado,
 * adoptamos el modo real del usuario.
 */

import { useEffect, useMemo, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme/theme";
import { useThemeStore } from "@/store/ui/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);

  // Hasta que el componente monte en el cliente, forzamos "light" para que
  // el HTML del servidor coincida con el primer render del cliente.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const theme = useMemo(
    () => getTheme(isMounted ? mode : "light"),
    [mode, isMounted]
  );

  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
