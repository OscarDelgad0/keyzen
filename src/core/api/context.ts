/**
 * Request identity context (the multi-tenant / auth seam).
 *
 * `apiFetch` calls this on every request and injects the values into the
 * headers. Services and UI never deal with tenant or token directly.
 *
 * Today these are fixed mock values. When real auth + multi-tenant land,
 * only the body of `getRequestContext` changes (it will read from the
 * session store), and nothing else in the app has to move.
 */

export interface RequestContext {
  /** Which tenant (locksmith business) this request belongs to. */
  tenantId: string;
  /** Auth token for the current user. */
  authToken: string;
}

export function getRequestContext(): RequestContext {
  // TODO (stage 2): read these from the real session (store/session).
  return {
    tenantId: "tenant-001",
    authToken: "mock-token",
  };
}
