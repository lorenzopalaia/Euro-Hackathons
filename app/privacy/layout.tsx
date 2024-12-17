import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Euro Hackathons",
  description: "Find your next hackathon 🚀",
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
