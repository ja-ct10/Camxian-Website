"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { SocialIcon } from "./social-icon";

const links = [["/", "Home"], ["/about/", "About"], ["/product-services/", "Product & Services"], ["/contact/", "Contact us"]] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; dialog.current?.close(); opener.current?.focus(); };
  }, [open]);

  return <>
    <header className={`elementor elementor-92 site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="elementor-element elementor-element-66d4cab e-flex e-con-boxed e-con e-parent">
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-b703e90 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-d14d96b elementor-widget img-logo elementor-widget-theme-site-logo">
              <div className="elementor-widget-container"><Link href="/" aria-label="Camxian Technologies home"><img src="/images/logo@3x.png" width="1005" height="171" alt="Camxian Technologies" /></Link></div>
            </div>
          </div>
          <div className="elementor-element elementor-element-25dd92e e-con-full e-flex e-con e-child">
            <nav aria-label="Main navigation" className="desktop-navigation">
              {links.slice(0, 3).map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
            </nav>
            <div className="desktop-contact"><Button href="/contact/" aria-current={pathname === "/contact/" ? "page" : undefined}>Contact us</Button></div>
            <button ref={opener} className="menu-toggle" aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><svg width="31" height="31" viewBox="0 0 26.002 18.527" fill="none" aria-hidden="true"><g stroke="#4969d0" strokeLinecap="round" strokeWidth="4"><path d="M2 2h22.002M2 9.264h22.002M2 16.527h22.002" /></g></svg></button>
          </div>
        </div>
      </div>
    </header>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-navigation" aria-label="Navigation" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <button className="menu-close" aria-label="Close navigation menu" onClick={() => setOpen(false)}>×</button>
      <nav aria-label="Mobile navigation">{links.map(([href, label]) => <Link href={href} key={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="mobile-menu-footer"><div className="mobile-socials">
        <a href="https://www.facebook.com/CamxianTechnologies?mibextid=LQQJ4d" aria-label="Facebook"><SocialIcon name="facebook-f" /></a>
        <a href="https://www.instagram.com/camxiantech?igsh=MWE0ZHc0dmE1cHg5bw==" aria-label="Instagram"><SocialIcon name="instagram" /></a>
        <a href="https://www.tiktok.com/@camxiantechnologies?_t=8pUoZPQ9u9B&_r=1" aria-label="TikTok"><SocialIcon name="tiktok" /></a>
        <a href="https://www.linkedin.com/company/camxiantechnologies" aria-label="LinkedIn"><SocialIcon name="linkedin-in" /></a>
      </div><p>180 Dr. Sixto Ave. Bgy Caniogan,<br />Pasig City, Metro Manila</p></div>
    </dialog>
  </>;
}
