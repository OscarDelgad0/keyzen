/**
 * Esquema de la configuración de tenant.
 *
 * Representa el "JSON grande de configuración" que el backend (ASP.NET)
 * entregará por tenant al iniciar sesión. Aquí solo definimos lo que el front
 * consume HOY; el objeto crecerá con más secciones (branding, módulos,
 * monedas, formatos...) sin romper lo existente, porque está anidado.
 *
 * Contrato en inglés: estos nombres son los que la API de C# deberá respetar.
 */

import { z } from "zod";

/** Vistas posibles para listados que soportan tabla o tarjetas. */
export const listViewSchema = z.enum(["table", "cards"]);
export type ListView = z.infer<typeof listViewSchema>;

/**
 * Preferencias de interfaz del tenant.
 * Anidado por sección para que escale: ui.<seccion>.<preferencia>.
 */
export const tenantUiConfigSchema = z.object({
  inventory: z.object({
    /** Vista por defecto del listado de inventario para este tenant. */
    defaultView: listViewSchema,
  }),
});
export type TenantUiConfig = z.infer<typeof tenantUiConfigSchema>;

/**
 * Configuración completa del tenant.
 * Por ahora solo `ui`; se añadirán más bloques conforme el backend los mande.
 */
export const tenantConfigSchema = z.object({
  /** Identificador del tenant (útil para validar/depurar). */
  tenantId: z.string(),
  ui: tenantUiConfigSchema,
});
export type TenantConfig = z.infer<typeof tenantConfigSchema>;
