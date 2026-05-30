/**
 * Estado global del modo de color (claro / oscuro).
 *
 * Guarda el modo actual y permite alternarlo. Usa `persist` para recordar
 * la preferencia del usuario entre sesiones (se guarda en localStorage).
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "@/theme/theme";

interface ThemeState {
  /** Modo de color actual. */
  mode: ThemeMode;
  /** Alterna entre claro y oscuro. */
  toggleMode: () => void;
  /** Fija un modo concreto. */
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
      setMode: (mode) => set({ mode }),
    }),
    { name: "locksmith-theme" }
  )
);
