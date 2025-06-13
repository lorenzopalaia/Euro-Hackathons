"use client";

import { useState, useEffect } from "react";

interface UrlPreview {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export function useUrlPreview(url: string) {
  const [preview, setPreview] = useState<UrlPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usando una API gratuita per i metadati
        const response = await fetch(
          `/api/preview?url=${encodeURIComponent(url)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preview");
        }

        const data = await response.json();
        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setPreview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  return { preview, loading, error };
}
