import type { Metadata } from "next";
import "./globals.css";
import { FilterProvider } from "@/contexts/filter-context";

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
      <body className="dark font-sans antialiased">
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
