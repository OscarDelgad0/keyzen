/**
 * Configuración de tenant de ejemplo (mock).
 *
 * Simula el JSON que enviará el backend de C#. Al apagar useMocks y conectar
 * ASP.NET, esto deja de usarse; el contrato (forma) sigue siendo el mismo.
 */

import type { TenantConfig } from "@/modules/tenant/schemas";

export const mockTenantConfig: TenantConfig = {
  tenantId: "tenant-demo",
  ui: {
    inventory: {
      defaultView: "table",
    },
  },
};
