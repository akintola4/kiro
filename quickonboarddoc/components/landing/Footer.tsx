import { Ghost } from "lucide-react";
import Link from "next/link";
import { IconBrandLinkedin, IconBrandX, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";

const footerLinks = {
  company: [
    { label: "About", href: "/#about" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/#contact" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Support", href: "/dashboard/contact" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  social: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: IconBrandLinkedin, external: true },
    { label: "X", href: "https://x.com", icon: IconBrandX, external: true },
    { label: "Instagram", href: "https://instagram.com", icon: IconBrandInstagram, external: true },
    { label: "YouTube", href: "https://www.youtube.com/@DevAkintola", icon: IconBrandYoutube, external: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ghost className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-lg">QuickOnboardDoc</span>
            </Link>
          </div>

          {/* Company Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} QuickOnboardDoc, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
