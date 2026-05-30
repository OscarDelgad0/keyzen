# Sistema Administrativo y POS — Cerrajería

Documento de contexto reutilizable. Pegar al inicio de un nuevo chat para retomar el proyecto sin perder decisiones.

---

## 1. Qué es el proyecto

Sistema administrativo y punto de venta (POS) para una cerrajería automotriz y residencial. Administra ventas, servicios, inventario, entradas/salidas, movimientos, clientes y reportes.

**Productos:** llaves residenciales, llaves automotrices, controles, chips, chapas, gomas, listones, accesorios, materiales.
**Servicios:** apertura de carros, apertura de casas, duplicados, hechura de llaves, y otros (administrables desde tablas dinámicas a futuro).

**Visión a futuro:** convertirse en un **SaaS multi-tenant** (vender el sistema a varias cerrajerías). Hoy es para un solo negocio, pero la arquitectura deja "costuras" preparadas (ver sección 7).

---

## 2. Arquitectura general

- Frontend y backend **completamente separados**.
- **Etapa 1 (actual): solo frontend con mocks.** Construir toda la UI antes de tocar backend.
- **Etapa 2:** conexión gradual a backend en **ASP.NET Core (C#) + PostgreSQL**.
- Objetivo etapa 1: validar visual y funcionalmente cada módulo con datos simulados.

---

## 3. Stack frontend (definitivo)

- **Next.js** (App Router)
- **TypeScript**
- **Material UI (MUI)** para componentes y theme
- **SCSS Modules** para estilos a medida
- **Zustand** para estado global
- **Zod** para esquemas + validación + tipos inferidos
- **NO se usa Tailwind CSS**

---

## 4. Idioma y convenciones de nombres

- **TODO en inglés:** variables, funciones, carpetas, archivos, componentes.
- Nombres **simples, claros y descriptivos**. Sin abreviaturas raras.
- Componentes React en `PascalCase` (`Button.tsx`, `DataTable.tsx`).
- Archivos no-componente y carpetas en `camelCase`/minúscula (`apiFetch.ts`, `inventory/`).
- Funciones como verbos claros (`getProducts`, `createProduct`, `validateForm`).
- Booleanos con prefijo (`isLoading`, `hasError`).

---

## 5. Principios obligatorios (reglas del proyecto)

- Nunca generar código sin autorización explícita.
- Antes de codificar: analizar, proponer y explicar el enfoque. Validar con el dueño.
- Construir todo modularmente. Evitar sobreingeniería.
- Mobile-first: el teléfono es el medio principal de uso.
- Priorizar reutilización, modularidad, escalabilidad, consistencia visual y separación de responsabilidades.
- Cada módulo: analizar qué componentes crear, reutilizar o modificar, y por qué.
- Basar decisiones en documentación oficial y mejores prácticas modernas.

---

## 6. Patrón de construcción de componentes

Cada componente tiene un **elemento principal** + **características acompañantes que viven con él** (no componentes sueltos a un lado).

- Ejemplo maestro — el **Input**: el campo es el elemento principal; el error es una **prop** que el propio input recibe y pinta (se pone en rojo, muestra el mensaje debajo). No se arma a mano cada vez.
- **Props obligatorias** (lo mínimo para funcionar) + **props opcionales** con defaults sensatos (error, label, helper text, icon, disabled...). Si no se pasa el error, no se muestra.
- Mismo patrón en todos: la tabla recibe opcionalmente loading/empty/columnas; el botón recibe opcionalmente loading/icon/variant; la card recibe opcionalmente acciones/header.
- Resultado: un mismo componente sirve para casos simples y complejos sin duplicar código.

---

## 7. Costuras para SaaS multi-tenant (preparadas, NO construidas)

Multi-tenant = cada cerrajería es un "tenant" con datos aislados. El aislamiento real es BACKEND (etapa 2). En frontend solo se evitan supuestos de "un solo negocio":

- **Contexto de identidad en cada petición:** `apiFetch` siempre adjunta tenant + auth (hoy mock fijo, ej. `tenant-001`).
- **Branding centralizado:** nombre, logo, colores salen de un solo lugar (`theme/brand.ts`), no hardcodeados por la app.
- **Mocks namespaced por tenant** (disciplina de organización).

NO se construyen ahora: selección de tenant, planes, billing, subdominios, login multi-tenant.

### Permisos y roles
- El backend es la **fuente de verdad** de la seguridad (etapa 2). El frontend solo refleja para UX (ocultar botones/módulos sin acceso).
- Se deja una **costura de rol/permisos en Zustand** (`store/session`) + un helper tipo "¿puede el usuario hacer X?". Hoy mock (admin con todo); mañana se llena desde la sesión real sin reescribir vistas.

---

## 8. Capa de datos: servicios mock simulados

- La UI llama a funciones async (`getProducts()`) que devuelven `Promise` con latencia simulada.
- Los componentes manejan loading/error desde el inicio (UX móvil).
- Al conectar ASP.NET solo cambia el **cuerpo** de esas funciones; la UI no se toca.

---

## 9. Capa fetch (diseño aprobado — primer entregable a construir)

Una sola función envuelve TODA comunicación con la API. Cuatro capas, de abajo a arriba:

1. **`apiFetch`** (`core/api/apiFetch.ts`): cliente central. Construye URL desde base configurable, inyecta headers + contexto tenant/auth, ejecuta, normaliza respuesta y errores. Nadie usa `fetch` nativo directo.
2. **Validación con Zod**:
   - **Validación de contenido (negocio):** en el front ANTES de enviar (y también en el back). Si falla, no se hace la petición.
   - **Validación de FORMA de la respuesta:** SIEMPRE. Red de seguridad: al llegar los datos se revisan contra el esquema esperado; si el back manda algo con forma incorrecta, falla controladamente aquí, no en un componente lejano. El mismo esquema da los tipos TS (no es trabajo extra).
3. **Servicios por dominio** (`modules/<modulo>/services`): funciones con nombres de negocio (`getProducts`). Aquí vive el switch mock/real.
4. **Hooks / UI**: consumen servicios y manejan loading/error/datos.

### Respuesta normalizada + tipos de error (aprobado)
Toda llamada devuelve la MISMA estructura: éxito sí/no, datos (si éxito), error (si falla). El error indica su **tipo**:
- **network** — sin conexión / servidor no responde -> "revisa tu conexión".
- **validation** — datos inválidos o respuesta con forma incorrecta -> marcar el campo en el formulario.
- **business** — el back rechazó por regla de negocio (ej. "stock insuficiente") -> mostrar el mensaje del back.

Dónde aterriza cada error: **validation** -> en el input/campo; **network** y **business** -> aviso a nivel de pantalla. La clasificación se hace UNA vez en `apiFetch`; las pantallas solo preguntan el tipo.

### Diseño detallado APROBADO (cierre)
- **Respuesta normalizada:** éxito `{ ok: true, data }` / fallo `{ ok: false, error: { type, message, details? } }`. `type` = "network" | "validation" | "business".
- **`apiFetch` NUNCA lanza excepción** a la UI: siempre devuelve el objeto normalizado. La UI solo revisa `ok`, sin try/catch disperso.
- **Parámetros de `apiFetch`:** `path` (obligatorio), `method`, `body?`, `requestSchema?` (valida el body antes de enviar), `responseSchema` (valida la forma de vuelta).
- **GET vs POST:** GET no lleva `requestSchema` (no hay validación de ida); POST/PUT validan ida (body) y vuelta. El paso de validar body se salta solo si no hay `requestSchema`.
- **Validación de forma de vuelta = SIEMPRE.** Calibrable por campo con Zod: estricta en lo crítico (price, stock, ids), flexible/opcional en lo accesorio (no bloquear toda la pantalla por un campo secundario).
- **Flujo de `apiFetch`:** 1) validar body si aplica (falla -> validation error, sin red) -> 2) armar petición (contexto + url + headers) -> 3) ejecutar (falla -> network error) -> 4) ¿back rechazó? -> business error -> 5) validar forma respuesta (falla -> validation error) -> ok -> `{ ok: true, data }`.
- **`context.ts`:** `getRequestContext() -> { tenantId, authToken }`. Hoy mock fijo; mañana de la sesión real. Inyección invisible: los servicios no lo pasan a mano.
- **Mocks pasan por la validación de forma** igual que el backend real (para detectar inconsistencias en los propios datos simulados).
- **Estados de pantalla (UI):** loading -> spinner/skeleton; ok -> datos; error -> bloque controlado (mensaje + botón reintentar). Nunca pantalla rota ni en blanco. Mismo camino para network/validation/business.

---

## 10. Estructura de carpetas (aprobada, en inglés)

```
src/
├── app/
│   └── (admin)/                  # route group: layout administrativo compartido
│       ├── dashboard/
│       ├── inventory/
│       ├── services/
│       ├── sales/
│       └── ...                   # un folder por módulo
│
├── components/                   # componentes REUTILIZABLES
│   ├── ui/                       # base: button, card, field, modal, alert...
│   ├── table/                    # tabla reutilizable
│   ├── form/                     # inputs, selects, etc.
│   └── layout/                   # sidebar, topbar, contenedores
│
├── core/                         # corazón técnico (capa fetch)
│   ├── api/
│   │   ├── apiFetch.ts           # cliente central
│   │   ├── response.ts           # respuesta normalizada + tipos de error
│   │   └── context.ts            # inyección de tenant/auth (costura SaaS)
│   └── config/
│       └── env.ts                # base URL, variables de entorno
│
├── modules/                      # lógica por dominio (desacoplada)
│   ├── inventory/
│   │   ├── schemas/              # esquemas Zod (request + response + tipos)
│   │   ├── services/             # funciones de negocio (mock hoy, API mañana)
│   │   ├── mocks/                # datos simulados
│   │   └── hooks/                # hooks de carga/error/datos
│   ├── services/
│   ├── sales/
│   └── ...
│
├── store/                        # Zustand: slices por dominio
│   ├── session/                  # user, role, permissions, tenant (costuras)
│   └── ui/                       # estado de interfaz
│
├── theme/                        # MUI theme + branding centralizado (SaaS)
│   ├── theme.ts
│   └── brand.ts                  # nombre, logo, colores del tenant
│
└── utils/                        # helpers genéricos (dates, format, permissions)
```

Ideas clave: `core/` aísla lo técnico transversal; `modules/` son autocontenidos (schemas+services+mocks+hooks juntos) y desacoplados; `components/` solo lo reutilizable entre módulos; `store/session` aterriza roles/permisos/tenant; `theme/brand.ts` centraliza branding.

---

## 11. Roadmap modular (orden óptimo)

0. **Foundations** — setup Next+TS+MUI+SCSS+Zustand+Zod, theme mobile-first, estructura de carpetas, alias, **capa fetch (core/api)**, componentes base (Button, Card, Input, Table, Modal, Select, Drawer, Alert).
1. **Admin shell** — layout: drawer/sidebar responsive, topbar, navegación, dashboard contenedor vacío.
2. **Inventory** — products y categories (CRUD mock). Define patrón de tabla/form reutilizable. Base de todo.
3. **Services** — catálogo administrable. Reutiliza patrones.
4. **Sales / POS** — vista rápida; consume Inventory + Services.
5. **Stock movements (in/out)** — afectan stock; requieren Inventory estable.
6. **Customers** — desacoplado; adelantable si el POS lo necesita.
7. **Reports / Analytics** — etapa final.

Razonamiento: cada fase reutiliza componentes de la anterior. Inventory crea el patrón de tabla/form que reusan Services, POS y Customers.

---

## 12. Buenas prácticas adoptadas (origen: curso "Teslo Shop", Next 14)

Se toman patrones ESTRUCTURALES (no su stack visual, que era Tailwind+Prisma):
- Organización de `src/` por responsabilidad.
- **Barrel files** (`index.ts`) para imports limpios.
- UI local junto a la ruta; reutilizables en `components/`.
- **Route groups** de App Router para layouts compartidos.
- Interfaces/esquemas tipados centralizados por dominio.
- **Zustand en slices por dominio** con `persist` donde aplique.
- (El curso usaba `actions/` por server actions de Next; NO aplica aquí porque el back es ASP.NET.)

---

## 13. Estado actual del trabajo

- [x] Analizado el curso y extraídas buenas prácticas.
- [x] Definido stack, roadmap, mocks, multi-tenant/permisos, convenciones (inglés), patrón de componentes.
- [x] Diseño conceptual de la capa fetch APROBADO (validación de forma siempre + 3 tipos de error).
- [x] Diseño DETALLADO de la capa fetch APROBADO (ver sección 9: respuesta normalizada, flujo, GET/POST, estados de pantalla).
- [ ] **Siguiente:** implementar la capa fetch (`response.ts`, `context.ts`, `apiFetch.ts`) — pendiente de autorización para escribir código.
- [ ] Resto de Foundations (setup proyecto, theme, componentes base) — pendiente.

> Actualizar esta sección conforme avance el proyecto.
