import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { AVAILABLE_THEMES, DEFAULT_THEME_ID } from "@/lib/theme-store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Euro Hackathons",
    default: "Euro Hackathons - Discover European Hackathons",
  },
  description:
    "Comprehensive list of hackathons happening across Europe. Real-time updates, advanced filtering, and notifications via Discord, Telegram, and Twitter.",
  keywords: [
    "hackathons",
    "europe",
    "coding",
    "programming",
    "tech events",
    "AI",
    "blockchain",
    "web3",
    "startup events",
    "developer events",
  ],
  authors: [{ name: "Lorenzo Palaia" }],
  creator: "Lorenzo Palaia",
  publisher: "Euro Hackathons",
  alternates: {
    canonical: "https://euro-hackathons.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://euro-hackathons.vercel.app",
    title: "Euro Hackathons - Discover European Hackathons",
    description:
      "Comprehensive list of hackathons happening across Europe. Real-time updates, advanced filtering, and notifications.",
    siteName: "Euro Hackathons",
    images: [
      {
        url: "/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Euro Hackathons Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Euro Hackathons - Discover European Hackathons",
    description: "Comprehensive list of hackathons happening across Europe",
    creator: "@EuroHackathons",
    images: ["/images/preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "TB0TYlzW_qq6j67WODPxTQYoOj24JPPfUrolfXE2gN4",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("eu_theme")?.value || "";
  let serverThemeId = DEFAULT_THEME_ID;
  let serverMode: "light" | "dark" = "dark";

  if (cookieValue) {
    try {
      const [id, mode] = cookieValue.split("|");
      if (id) serverThemeId = id;
      if (mode === "light" || mode === "dark") serverMode = mode;
    } catch {}
  }

  const serverTheme =
    AVAILABLE_THEMES.find((t) => t.id === serverThemeId) ||
    AVAILABLE_THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;

  const styles = serverTheme.styles[serverMode];

  const camelToKebab = (str: string) =>
    str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  const cssVars = Object.entries(styles)
    .map(([k, v]) => `--${camelToKebab(k)}: ${v};`)
    .join("\n");

  const inlineCss = `:root {\n${cssVars}\n}`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={serverMode === "dark" ? "dark" : undefined}
    >
      <head>
        <style
          id="server-theme"
          dangerouslySetInnerHTML={{ __html: inlineCss }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  function camelToKebab(s){return s.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();}
                  // Se esiste il cookie eu_theme, assumiamo che il server abbia già iniettato il tema corretto
                  if (document.cookie.split('; ').find(c=>c.indexOf('eu_theme=')===0)) return;

                  var stored = null;
                  try { stored = localStorage.getItem('theme-storage'); } catch { stored = null; }
                  if (!stored) return;
                  var state = null;
                  try { state = JSON.parse(stored).state; } catch { state = null; }
                  if (!state) return;
                  var mode = state.currentMode || 'dark';
                  var styles = state.styles && state.styles[mode];
                  if (!styles) return;
                  Object.keys(styles).forEach(function(k){
                    try { document.documentElement.style.setProperty('--' + camelToKebab(k), styles[k]); } catch {}
                  });
                  if (mode === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
                } catch {}
              })();
            `,
          }}
        />

        <StructuredData type="website" />
        <meta
          name="google-site-verification"
          content="TB0TYlzW_qq6j67WODPxTQYoOj24JPPfUrolfXE2gN4"
        />
      </head>
      <body
        className={`font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable}`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
