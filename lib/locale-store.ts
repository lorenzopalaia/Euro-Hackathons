import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocaleState = {
  locale: string;
  setLocale: (l: string) => void;
};

const getInitialLocale = () => {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("locale-storage");
    if (stored) {
      const parsed = JSON.parse(stored).state;
      if (parsed && parsed.locale) return parsed.locale;
    }
  } catch {}
  // fallback
  return "en";
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      setLocale: (l: string) => {
        set({ locale: l });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "locale-storage",
              JSON.stringify({ state: { locale: l } })
            );
          } catch {}
        }
      },
    }),
    {
      name: "locale-storage",
      partialize: (s) => ({ locale: s.locale }),
    }
  )
);

export default useLocaleStore;
