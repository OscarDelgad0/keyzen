# Locksmith Admin — Frontend

Sistema administrativo y POS para cerrajería. Etapa 1: frontend con mocks.

## Stack
Next.js · TypeScript · MUI · SCSS Modules · Zustand · Zod

## Arranque
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Qué hay hasta ahora (Foundations, en progreso)
- Estructura de carpetas base (ver `src/`).
- **Capa fetch** (`src/core/api/`): `apiFetch`, `response`, `context`. Único punto de comunicación con la API. Ver `CONTEXTO_PROYECTO.md` sección 9.
- Config de entorno (`src/core/config/env.ts`).

Las carpetas con `.gitkeep` están preparadas pero vacías; se llenarán módulo por módulo.

> `CONTEXTO_PROYECTO.md` contiene todas las decisiones de arquitectura. Úsalo como contexto si abres un chat nuevo.
