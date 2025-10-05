"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";
import { applyThemeToElement } from "@/lib/theme-utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeState = useThemeStore();

  useEffect(() => {
    // Applica il tema al mount
    const root = document.documentElement;
    applyThemeToElement(themeState, root);
  }, [themeState]);

  return <>{children}</>;
}
