import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google";
import "./globals.css";

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
  title: "Euro Hackathons",
  description: "Comprehensive list of hackathons happening across Europe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="TB0TYlzW_qq6j67WODPxTQYoOj24JPPfUrolfXE2gN4"
        />
      </head>
      <body
        className={`dark font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
