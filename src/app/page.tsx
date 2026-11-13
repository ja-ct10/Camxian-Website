import type { Metadata } from "next";
import { HomeHero, HomeAbout, Expertise, Customers, Partners, FutureReady } from "@/components/sections/home";
export const metadata: Metadata = { title: { absolute: "Home - Camxian Technologies" } };
export default function HomePage() {
  return <main id="main-content" className="elementor elementor-46"><HomeHero /><HomeAbout /><Expertise /><Customers /><Partners /><FutureReady /></main>;
}
