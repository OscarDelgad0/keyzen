/**
 * Central configuration read from environment variables.
 *
 * Keeping this in one place means the rest of the app never touches
 * `process.env` directly. When the real ASP.NET backend is wired up,
 * only `.env.local` changes here.
 */

export const env = {
  /** Base URL of the backend API. Empty while we are on mocks. */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",

  /** When true, services return mock data instead of calling the real API. */
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true") === "true",
} as const;
