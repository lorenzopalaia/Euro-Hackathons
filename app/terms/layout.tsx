import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Euro Hackathons",
  description: "Find your next hackathon 🇪🇺🚀",
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
