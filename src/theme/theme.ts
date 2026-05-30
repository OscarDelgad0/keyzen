/**
 * Construcción de los themes de MUI (claro y oscuro).
 *
 * Toma la paleta (palette.ts) y define tipografía, breakpoints mobile-first,
 * espaciados y los estilos por defecto de componentes:
 *  - botones e inputs con altura táctil cómoda (~44px), pensados para móvil
 *  - glass (glassmorphism) en Card, AppBar, Dialog y Drawer
 *  - el glass NO se aplica a filas de tabla (esas van planas, ver brand.ts)
 *
 * `getTheme(mode)` devuelve el theme correspondiente al modo recibido.
 */

import { createTheme, type Theme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "@/theme/palette";

export type ThemeMode = "light" | "dark";

/** Altura táctil base para controles (botones, inputs). Buena para dedo en móvil. */
const TOUCH_HEIGHT = 44;

/** Estilo glass según el modo. Se reutiliza en card, appbar, dialog y drawer. */
function glassBackground(mode: ThemeMode): Record<string, string> {
  const isDark = mode === "dark";
  return {
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(18px) saturate(150%)",
    WebkitBackdropFilter: "blur(18px) saturate(150%)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.12)"
      : "1px solid rgba(255, 255, 255, 0.70)",
    boxShadow: isDark
      ? "0 6px 24px rgba(0, 0, 0, 0.25)"
      : "0 6px 24px rgba(31, 38, 135, 0.08)",
  };
}

/** Crea el theme completo para el modo indicado. */
export function getTheme(mode: ThemeMode): Theme {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette,
    // Breakpoints mobile-first estándar de MUI (xs primero).
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: ['"Roboto"', '"Helvetica"', "Arial", "sans-serif"].join(","),
      // Solo dos pesos en uso: 400 regular y 500 medio.
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      button: {
        textTransform: "none", // sin MAYÚSCULAS forzadas
        fontWeight: 500,
      },
    },
    components: {
      // Botones: altura táctil, esquinas suaves, sin sombra agresiva.
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            minHeight: TOUCH_HEIGHT,
            borderRadius: 8,
            paddingInline: 18,
          },
        },
      },
      // Inputs: misma altura táctil que los botones.
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            minHeight: TOUCH_HEIGHT,
            borderRadius: 8,
          },
        },
      },
      // Card con glass.
      MuiCard: {
        styleOverrides: {
          root: {
            ...glassBackground(mode),
            borderRadius: 14,
            backgroundImage: "none",
          },
        },
      },
      // Barra superior con glass.
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "transparent" },
        styleOverrides: {
          root: {
            ...glassBackground(mode),
            borderRadius: 0,
          },
        },
      },
      // Modal con glass.
      MuiDialog: {
        styleOverrides: {
          paper: {
            ...glassBackground(mode),
            borderRadius: 16,
            backgroundImage: "none",
          },
        },
      },
      // Drawer con glass.
      MuiDrawer: {
        styleOverrides: {
          paper: {
            ...glassBackground(mode),
            backgroundImage: "none",
          },
        },
      },
      // Filas de tabla algo más compactas (sin glass; el color de estado se aplica
      // en el componente de tabla cuando se construya, leyendo de brand.ts).
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 12,
            paddingBottom: 12,
          },
          head: {
            fontWeight: 500,
          },
        },
      },
    },
  });
}
