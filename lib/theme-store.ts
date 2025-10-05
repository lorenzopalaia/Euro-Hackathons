import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ThemeState,
  ThemeConfig,
  ThemePreset,
  ThemePresetStyles,
  ThemeStyles,
} from "@/types/theme";
import { defaultPresets } from "@/lib/theme-presets";

interface ThemeStore extends ThemeState {
  setThemeById: (themeId: string) => void;
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
}

// Conversione inline da preset a ThemeConfig
const convertPresetStylesToThemeStyles = (
  presetStyles: ThemePresetStyles,
): ThemeStyles => {
  return {
    background: presetStyles.background,
    foreground: presetStyles.foreground,
    card: presetStyles.card,
    cardForeground: presetStyles["card-foreground"],
    popover: presetStyles.popover,
    popoverForeground: presetStyles["popover-foreground"],
    primary: presetStyles.primary,
    primaryForeground: presetStyles["primary-foreground"],
    secondary: presetStyles.secondary,
    secondaryForeground: presetStyles["secondary-foreground"],
    muted: presetStyles.muted,
    mutedForeground: presetStyles["muted-foreground"],
    accent: presetStyles.accent,
    accentForeground: presetStyles["accent-foreground"],
    destructive: presetStyles.destructive,
    destructiveForeground: presetStyles["destructive-foreground"],
    border: presetStyles.border,
    input: presetStyles.input,
    ring: presetStyles.ring,
    chart1: presetStyles["chart-1"],
    chart2: presetStyles["chart-2"],
    chart3: presetStyles["chart-3"],
    chart4: presetStyles["chart-4"],
    chart5: presetStyles["chart-5"],
    sidebar: presetStyles.sidebar,
    sidebarForeground: presetStyles["sidebar-foreground"],
    sidebarPrimary: presetStyles["sidebar-primary"],
    sidebarPrimaryForeground: presetStyles["sidebar-primary-foreground"],
    sidebarAccent: presetStyles["sidebar-accent"],
    sidebarAccentForeground: presetStyles["sidebar-accent-foreground"],
    sidebarBorder: presetStyles["sidebar-border"],
    sidebarRing: presetStyles["sidebar-ring"],
    radius: presetStyles.radius,
    fontSans: presetStyles["font-sans"],
    fontSerif: presetStyles["font-serif"],
    fontMono: presetStyles["font-mono"],
    letterSpacing: presetStyles["letter-spacing"],
    shadowColor: presetStyles["shadow-color"],
    shadowOpacity: presetStyles["shadow-opacity"],
    shadowBlur: presetStyles["shadow-blur"],
    shadowSpread: presetStyles["shadow-spread"],
    shadowOffsetX: presetStyles["shadow-offset-x"],
    shadowOffsetY: presetStyles["shadow-offset-y"],
  };
};

const convertPresetToConfig = (
  id: string,
  preset: ThemePreset,
): ThemeConfig => ({
  id,
  name: preset.label,
  styles: {
    light: convertPresetStylesToThemeStyles(preset.styles.light),
    dark: convertPresetStylesToThemeStyles(preset.styles.dark),
  },
});

// Converti i preset in ThemeConfig[] e ordina alfabeticamente per nome
export const AVAILABLE_THEMES: ThemeConfig[] = Object.entries(defaultPresets)
  .map(([id, preset]) => convertPresetToConfig(id, preset))
  .sort((a, b) => a.name.localeCompare(b.name));
export const DEFAULT_THEME_ID = "clean-slate";

// Funzione per ottenere il tema di default
const getDefaultTheme = () => {
  const defaultTheme = AVAILABLE_THEMES.find((t) => t.id === DEFAULT_THEME_ID);
  if (!defaultTheme) {
    throw new Error(`Default theme with id "${DEFAULT_THEME_ID}" not found`);
  }
  return defaultTheme;
};

// Funzione per determinare la modalità iniziale
const getInitialMode = (): "light" | "dark" => {
  if (typeof window === "undefined") return "dark";

  // Prima controlla localStorage
  const stored = localStorage.getItem("theme-mode");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Default: dark mode
  return "dark";
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      styles: getDefaultTheme().styles,
      currentMode: getInitialMode(),

      setThemeById: (themeId: string) => {
        const theme = AVAILABLE_THEMES.find((t) => t.id === themeId);
        if (theme) {
          set({ styles: theme.styles });
        }
      },

      toggleMode: () => {
        set((state) => {
          const newMode = state.currentMode === "light" ? "dark" : "light";
          // Salva in localStorage separatamente
          if (typeof window !== "undefined") {
            localStorage.setItem("theme-mode", newMode);
          }
          return { currentMode: newMode };
        });
      },

      setMode: (mode: "light" | "dark") => {
        set({ currentMode: mode });
        // Salva in localStorage separatamente
        if (typeof window !== "undefined") {
          localStorage.setItem("theme-mode", mode);
        }
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        styles: state.styles,
        currentMode: state.currentMode,
      }),
    },
  ),
);
