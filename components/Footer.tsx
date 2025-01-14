import Link from "next/link";

import Image from "next/image";

import { Github } from "lucide-react";

const footerData = {
  sections: [
    {
      title: "Resources",
      links: [
        {
          href: "https://github.com/lorenzopalaia/euro-hackathons",
          label: "GitHub",
        },
      ],
    },
    {
      title: "Follow us",
      links: [
        { href: "https://github.com/lorenzopalaia", label: "Lorenzo Palaia" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
      ],
    },
  ],
  socialLinks: [
    {
      href: "https://github.com/lorenzopalaia/euro-hackathons",
      icon: Github,
      label: "GitHub account",
    },
  ],
};

export default function Footer() {
  return (
    <footer className="container mx-auto mt-16 max-w-4xl p-4 py-6 lg:py-8">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link
            href="https://eurohackathons.lorenzopalaia.it/"
            className="flex items-center gap-2"
          >
            <Image src="/logo.png" alt="Logo" width={48} height={48} />
            <span className="self-center whitespace-nowrap text-2xl font-semibold">
              Euro Hackathons
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
          {footerData.sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-6 text-sm font-semibold uppercase">
                {section.title}
              </h2>
              <ul className="font-medium text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label} className="mb-4">
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <hr className="my-6 border-muted-foreground/50 sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm sm:text-center">
          © {new Date().getFullYear()}{" "}
          <Link
            href="https://eurohackathons.lorenzopalaia.it/"
            className="hover:underline"
          >
            Euro Hackathons
          </Link>
          ™ - All Rights Reserved.
        </span>
        <div className="mt-4 flex sm:mt-0 sm:justify-center">
          {footerData.socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              className="ms-5 text-muted-foreground hover:text-foreground"
            >
              <social.icon />
              <span className="sr-only">{social.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
