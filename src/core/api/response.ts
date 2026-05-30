/**
 * Normalized response contract.
 *
 * Every call through `apiFetch` returns one of these shapes, so the UI
 * never has to guess. It only checks `ok` and reacts. No scattered
 * try/catch, no per-endpoint error shapes.
 */

/** The three reasons a request can fail, each handled differently by the UI. */
export type ApiErrorType =
  | "network" // no connection / server did not respond -> "check your connection"
  | "validation" // payload invalid OR response shape unexpected -> mark field / show error
  | "business"; // backend rejected by a business rule (e.g. "out of stock")

export interface ApiError {
  /** Category of the failure, so the UI can react accordingly. */
  type: ApiErrorType;
  /** Human-readable message safe to show to the user. */
  message: string;
  /**
   * Optional extra detail. For validation errors this can carry the
   * field-level issues (e.g. which field failed and why).
   */
  details?: unknown;
}

/** Successful result: carries the validated data. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

/** Failed result: carries a typed error, never data. */
export interface ApiFailure {
  ok: false;
  error: ApiError;
}

/** The only thing `apiFetch` ever returns. */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Helper to build a success result. */
export function ok<T>(data: T): ApiSuccess<T> {
  return { ok: true, data };
}

/** Helper to build a failure result. */
export function fail(
  type: ApiErrorType,
  message: string,
  details?: unknown
): ApiFailure {
  return { ok: false, error: { type, message, details } };
}
