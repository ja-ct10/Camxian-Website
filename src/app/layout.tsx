import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Camxian Technologies", template: "%s - Camxian Technologies" },
  description: "Security, Telecom, and IT solutions. Technology that will shape your future.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="stylesheet" href="https://use.typekit.net/gtm6uee.css" /></head><body className="elementor-default elementor-kit-10"><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
