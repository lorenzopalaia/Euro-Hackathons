export interface ThemeStyles {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  radius?: string;
  fontSans?: string;
  fontSerif?: string;
  fontMono?: string;
  letterSpacing?: string;
  shadowColor?: string;
  shadowOpacity?: string;
  shadowBlur?: string;
  shadowSpread?: string;
  shadowOffsetX?: string;
  shadowOffsetY?: string;
}

export interface ThemeState {
  styles: {
    light: ThemeStyles;
    dark: ThemeStyles;
  };
  currentMode: "light" | "dark";
}

export interface ThemeConfig {
  id: string;
  name: string;
  styles: {
    light: ThemeStyles;
    dark: ThemeStyles;
  };
}

// Type per i preset di temi (formato kebab-case usato in theme-presets.ts)
export interface ThemePresetStyles {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  radius?: string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
  "font-sans"?: string;
  "font-serif"?: string;
  "font-mono"?: string;
  "letter-spacing"?: string;
  "shadow-color"?: string;
  "shadow-opacity"?: string;
  "shadow-blur"?: string;
  "shadow-spread"?: string;
  "shadow-offset-x"?: string;
  "shadow-offset-y"?: string;
  spacing?: string;
}

export interface ThemePreset {
  label: string;
  createdAt?: string;
  styles: {
    light: ThemePresetStyles;
    dark: ThemePresetStyles;
  };
}
