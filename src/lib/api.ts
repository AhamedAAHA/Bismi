"use client";

export interface ApiResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function api<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: json.error || `Request failed (${res.status})` };
    }
    return { ok: true, data: json.data as T };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export const apiGet = <T = any>(url: string) => api<T>(url);
export const apiPost = <T = any>(url: string, body?: unknown) =>
  api<T>(url, { method: "POST", body: JSON.stringify(body ?? {}) });
export const apiPut = <T = any>(url: string, body?: unknown) =>
  api<T>(url, { method: "PUT", body: JSON.stringify(body ?? {}) });
export const apiDelete = <T = any>(url: string) =>
  api<T>(url, { method: "DELETE" });
