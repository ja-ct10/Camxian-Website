"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/** The original seven-slide timeline: 5/3/1 visible, 5s autoplay, 500ms motion. */
export function MilestoneCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const [visible, setVisible] = useState(5);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const pointerStart = useRef<number | undefined>(undefined);
  const last = Math.max(0, slides.length - visible);
  useEffect(() => {
    const update = () => { setVisible(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 3 : 5); setIndex(0); };
    update(); window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    if (hovered || interacted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex(current => current >= last ? 0 : current + 1), 5000);
    return () => clearInterval(timer);
  }, [hovered, interacted, last]);
  const move = (next: number) => { setInteracted(true); setIndex(Math.min(last, Math.max(0, next))); };
  return <>
    <div className="e-n-carousel swiper milestone-carousel" role="region" aria-roledescription="carousel" aria-label="Company milestones" tabIndex={0}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setInteracted(true)}
      onPointerDown={event => { pointerStart.current = event.clientX; }} onPointerUp={event => { if (pointerStart.current !== undefined && Math.abs(event.clientX - pointerStart.current) > 40) move(index + (event.clientX < pointerStart.current ? 1 : -1)); pointerStart.current = undefined; }}
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(index + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      <div className="swiper-wrapper" style={{ transform: `translate3d(-${index * 100 / visible}%, 0, 0)`, transitionDuration: "500ms" }} aria-live={interacted ? "polite" : "off"}>{slides}</div>
    </div>
    <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal">{Array.from({ length: last + 1 }, (_, item) => <button key={item} type="button" className={`swiper-pagination-bullet ${item === index ? "swiper-pagination-bullet-active" : ""}`} aria-label={`Go to slide ${item + 1}`} aria-current={item === index ? "true" : undefined} onClick={() => move(item)} />)}</div>
  </>;
}
