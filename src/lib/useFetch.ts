"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet } from "./api";

export function useFetch<T = any>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    const res = await apiGet<T>(url);
    if (res.ok) {
      setData(res.data as T);
    } else {
      setError(res.error || "Failed to load data");
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}
