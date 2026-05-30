/**
 * Branding centralizado del negocio.
 *
 * Aquí viven los valores crudos que identifican al sistema: color de acento,
 * nombre, logo y la paleta de estados. Es lo ÚNICO que cambia para re-brandear
 * o para que cada tenant tenga lo suyo en el futuro SaaS. El theme técnico
 * (palette.ts / theme.ts) solo CONSUME estos valores, nunca los hardcodea.
 */

/** Identidad del sistema. El nombre es un placeholder fácil de cambiar. */
export const brand = {
  name: "Locksmith Admin",
  /** Color de acento principal (azul profesional) y sus variantes. */
  accent: {
    main: "#185FA5",
    light: "#378ADD",
    dark: "#0C447C",
    contrastText: "#FFFFFF",
  },
} as const;

/**
 * Identificadores de estado usados en tablas.
 * Cada tabla puede definir su propio conjunto; este es el de inventario.
 */
export type StatusKey = "active" | "inactive" | "lowStock" | "outOfStock";

/**
 * Tonos de cada estado para el diseño de tabla en modo claro (APROBADO).
 *
 * Diseño de fila:
 *  - fondo de fila BLANCO (las inactivas usan `rowBg` gris + `rowOpacity`)
 *  - barra izquierda de 4px en `barColor` (color base con opacidad media)
 *  - chip de estado: fondo `chipBg` (color muy tenue) + texto `chipText` (tono oscuro)
 *  - sin glass; el precio va en peso normal
 *
 * Intensidad elegida: punto medio entre suave y vivo
 * (barra ~0.60 de opacidad, chip ~0.16).
 *
 * NOTA: el modo oscuro quedó pendiente de pulir en una fase posterior.
 */
export interface StatusTone {
  /** Etiqueta visible del estado. */
  label: string;
  /** Color RGB base del estado, ej. "22,98,178". Se usa con distintas opacidades. */
  baseRgb: string;
  /** Color de texto del chip (tono oscuro del estado). */
  chipText: string;
  /** Si true, la fila se muestra "apagada": fondo gris + opacidad. */
  faded?: boolean;
}

/** Opacidad de la barra izquierda sobre `baseRgb`. */
export const TABLE_BAR_OPACITY = 0.6;
/** Opacidad del fondo del chip sobre `baseRgb`. */
export const TABLE_CHIP_OPACITY = 0.16;
/** Fondo gris de las filas inactivas (modo claro). */
export const TABLE_FADED_ROW_BG = "#F0F1F3";
/** Opacidad de las filas inactivas. */
export const TABLE_FADED_ROW_OPACITY = 0.7;

/** Diccionario de estados de inventario. Consumido por el componente de tabla. */
export const inventoryStatusTones: Record<StatusKey, StatusTone> = {
  active: {
    label: "Activo",
    baseRgb: "22,98,178",
    chipText: "#0B3D74",
  },
  inactive: {
    label: "Inactivo",
    baseRgb: "145,144,137",
    chipText: "#605F5A",
    faded: true,
  },
  lowStock: {
    label: "Bajo stock",
    baseRgb: "233,167,15",
    chipText: "#735200",
  },
  outOfStock: {
    label: "Agotado",
    baseRgb: "226,65,64",
    chipText: "#8C1F1E",
  },
};
