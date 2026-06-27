"use client";

/**
 * Provider y hook de configuración de tenant.
 *
 * Carga el "JSON de tenant" UNA vez (al montar el provider) y lo expone a toda
 * la app. Las pantallas leen de aquí sus valores por defecto (ej. la vista de
 * inventario) sin volver a pedirlo.
 *
 * Mientras carga, `config` es null y `loading` es true: las pantallas deben
 * tolerar ese estado (usar un fallback hasta que llegue).
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTenantConfig } from "@/modules/tenant/services";
import type { TenantConfig } from "@/modules/tenant/schemas";

interface TenantConfigState {
  config: TenantConfig | null;
  loading: boolean;
  error: string | null;
}

const TenantConfigContext = createContext<TenantConfigState>({
  config: null,
  loading: true,
  error: null,
});

export function TenantConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TenantConfigState>({
    config: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getTenantConfig();
      if (!active) return;
      if (result.ok) {
        setState({ config: result.data, loading: false, error: null });
      } else {
        setState({ config: null, loading: false, error: result.error.message });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <TenantConfigContext.Provider value={state}>
      {children}
    </TenantConfigContext.Provider>
  );
}

/** Acceso a la configuración del tenant en cualquier componente. */
export function useTenantConfig(): TenantConfigState {
  return useContext(TenantConfigContext);
}
