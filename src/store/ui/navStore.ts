/**
 * Estado global de la navegación.
 *
 * Guarda si el sidebar está colapsado (persistido, para recordar la
 * preferencia entre sesiones) y si la hoja "Más" de móvil está abierta
 * (no persistido: es un estado momentáneo).
 *
 * El módulo activo NO se guarda aquí: se deriva de la ruta actual de Next,
 * que es la fuente de verdad de "dónde estoy".
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavState {
  /** Sidebar colapsado (solo íconos) o expandido (con nombres). */
  isSidebarCollapsed: boolean;
  /** Hoja "Más" de móvil abierta. */
  isMoreOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openMore: () => void;
  closeMore: () => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMoreOpen: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      openMore: () => set({ isMoreOpen: true }),
      closeMore: () => set({ isMoreOpen: false }),
    }),
    {
      name: "locksmith-nav",
      // Solo persistimos la preferencia del sidebar, no la hoja "Más".
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);
