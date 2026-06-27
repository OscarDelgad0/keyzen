/**
 * Central API client.
 *
 * The single entry point for ALL communication with the API. Nobody calls
 * native `fetch` directly. It never throws to the UI: it always returns a
 * normalized `ApiResult`.
 *
 * Flow:
 *   1. validate body (if a requestSchema is given) -> fail "validation" (no network)
 *   2. build the request (context + url + headers)
 *   3. execute -> fail "network" if it cannot reach the server
 *   4. backend rejected? -> fail "business" with the backend message
 *   5. validate response shape (always) -> fail "validation" if it doesn't match
 *      -> otherwise return ok(data)
 */

import { z } from "zod";
import { env } from "@/core/config/env";
import { getRequestContext } from "@/core/api/context";
import { ApiResult, fail, ok } from "@/core/api/response";
import { resolveMock, simulateLatency, parseQuery } from "@/core/api/mockRegistry";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiFetchOptions<TResponse, TBody = unknown> {
  /** Endpoint path, e.g. "/products". Joined to the configured base URL. */
  path: string;
  /** HTTP method. Defaults to "GET". */
  method?: HttpMethod;
  /** Body to send (writes only). */
  body?: TBody;
  /**
   * Zod schema that validates the body BEFORE sending. Optional: GET calls
   * have no body and skip this step.
   */
  requestSchema?: z.ZodType<TBody>;
  /**
   * Zod schema that validates the SHAPE of the response. Always provided so
   * a backend change is caught here, not deep inside a component.
   */
  responseSchema: z.ZodType<TResponse>;
}

export async function apiFetch<TResponse, TBody = unknown>(
  options: ApiFetchOptions<TResponse, TBody>
): Promise<ApiResult<TResponse>> {
  const { path, method = "GET", body, requestSchema, responseSchema } = options;

  // 1. Validate the body before touching the network (only when a schema exists).
  if (requestSchema && body !== undefined) {
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return fail(
        "validation",
        "Los datos enviados no son válidos.",
        parsed.error.flatten()
      );
    }
  }

  // 1b. MOCK MODE.
  if (env.useMocks) {
    const resolved = resolveMock(method, path);
    if (!resolved) return fail("network", `No hay un mock para ${method} ${path}.`);
    await simulateLatency();
    let mockPayload: unknown;
    try {
      mockPayload = await resolved.handler({ params: resolved.params, query: parseQuery(path), body });
    } catch {
      return fail("business", "El mock no pudo resolver la operación.");
    }
    const parsedMock = responseSchema.safeParse(mockPayload);
    if (!parsedMock.success) return fail("validation", "La respuesta (mock) no tiene el formato esperado.", parsedMock.error.flatten());
    return ok(parsedMock.data);
  }

  // 2. Build the request: inject identity context, base url, headers.
  const context = getRequestContext();
  const url = `${env.apiBaseUrl}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-Id": context.tenantId,
    Authorization: `Bearer ${context.authToken}`,
  };

  // 3. Execute. Any network-level failure is normalized to "network".
  let httpResponse: Response;
  try {
    httpResponse = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    return fail(
      "network",
      "No se pudo conectar. Revisa tu conexión e intenta de nuevo."
    );
  }

  // Parse the JSON payload once (tolerant: an empty body is allowed).
  let payload: unknown = undefined;
  const rawText = await httpResponse.text();
  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      return fail("validation", "La respuesta del servidor no es válida.");
    }
  }

  // 4. Backend rejected the request by a business rule (HTTP not ok).
  if (!httpResponse.ok) {
    const message = extractBusinessMessage(payload, httpResponse.status);
    return fail("business", message, payload);
  }

  // 5. Validate the response shape (always). Calibrated per schema elsewhere.
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    return fail(
      "validation",
      "La respuesta del servidor no tiene el formato esperado.",
      parsed.error.flatten()
    );
  }

  return ok(parsed.data);
}

/**
 * Pull a user-facing message out of a backend error payload, falling back to
 * a generic message keyed by HTTP status.
 */
function extractBusinessMessage(payload: unknown, status: number): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return `La operación no se pudo completar (código ${status}).`;
}
