/**
 * Registro del mock de configuración de tenant.
 * Importar este archivo (vía el servicio) registra la ruta una sola vez.
 */

import { registerMock } from "@/core/api";
import { mockTenantConfig } from "@/modules/tenant/mocks/tenant.data";

// GET /tenant/config -> configuración del tenant actual.
registerMock("GET", "/tenant/config", () => mockTenantConfig);
