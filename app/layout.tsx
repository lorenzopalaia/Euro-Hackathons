import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme-storage');
                  const mode = stored ? JSON.parse(stored).state?.currentMode || 'dark' : 'dark';
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
          suppressHydrationWarning
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
