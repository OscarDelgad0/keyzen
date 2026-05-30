/**
 * Paletas de color para MUI (modo claro y oscuro).
 *
 * Traduce el branding (brand.ts) a las dos paletas que MUI entiende.
 * Separado de theme.ts para poder afinar tonos sin tocar el resto del theme.
 *
 * Fondos TENUES a propósito: gris muy ligero con un toque de azul en claro,
 * gris muy oscuro en oscuro. No deben competir con los elementos.
 */

import type { PaletteOptions } from "@mui/material/styles";
import { brand } from "@/theme/brand";

/** Paleta para el modo claro. */
export const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: brand.accent.main,
    light: brand.accent.light,
    dark: brand.accent.dark,
    contrastText: brand.accent.contrastText,
  },
  background: {
    // Fondo de la app: tenue, gris muy ligero con un susurro de azul.
    default: "#EEF1F5",
    // Superficies (cards, paneles): blanco para contraste limpio.
    paper: "#FFFFFF",
  },
  text: {
    primary: "#1A2230",
    secondary: "#54637A",
    disabled: "#9AA4B2",
  },
  divider: "rgba(0, 0, 0, 0.08)",
  error: { main: "#E24B4A" },
  warning: { main: "#D85A30" },
  success: { main: "#1D9E75" },
  info: { main: "#378ADD" },
};

/** Paleta para el modo oscuro. */
export const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: brand.accent.light,
    light: "#85B7EB",
    dark: brand.accent.main,
    contrastText: "#FFFFFF",
  },
  background: {
    // Fondo de la app: gris muy oscuro, tenue.
    default: "#161B24",
    // Superficies: un escalón más claro que el fondo.
    paper: "#1F2632",
  },
  text: {
    primary: "#F0F4F9",
    secondary: "#AEBCCD",
    disabled: "#6B7787",
  },
  divider: "rgba(255, 255, 255, 0.10)",
  error: { main: "#E24B4A" },
  warning: { main: "#D85A30" },
  success: { main: "#5DCAA5" },
  info: { main: "#378ADD" },
};
