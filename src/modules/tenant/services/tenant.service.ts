/**
 * Servicio de configuración de tenant.
 *
 * Una sola llamada a apiFetch, escrita igual para mock y backend real.
 * Migrar a C# = apagar el flag; este servicio no cambia.
 */

import { apiFetch, type ApiResult } from "@/core/api";
import { tenantConfigSchema, type TenantConfig } from "@/modules/tenant/schemas";

import "@/modules/tenant/mocks/tenant.mocks";

export function getTenantConfig(): Promise<ApiResult<TenantConfig>> {
  return apiFetch({
    path: "/tenant/config",
    method: "GET",
    responseSchema: tenantConfigSchema,
  });
}
