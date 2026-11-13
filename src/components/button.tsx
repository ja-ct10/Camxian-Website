import Link from "next/link";
import type { ComponentProps } from "react";

export function Button({ className = "", ...props }: ComponentProps<"a"> & { href: string }) {
  const shared = { ...props, className: `elementor-button elementor-button-link elementor-size-sm ${className}` };
  return props.href.startsWith("/") ? <Link {...shared} href={props.href} /> : <a {...shared} rel={props.target === "_blank" ? "noopener noreferrer" : props.rel} />;
}

export function ArrowIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h18m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
