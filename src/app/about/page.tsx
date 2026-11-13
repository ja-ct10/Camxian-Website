import type { Metadata } from "next";
import { AboutHero, CompanyIntroduction, CompanyHistory, Milestones, Customers, Partners, VisionMission, CorporateValues, Team } from "@/components/sections/about";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() {
  return <main id="main-content" className="elementor elementor-80"><AboutHero /><CompanyIntroduction /><CompanyHistory /><Milestones /><Customers /><Partners /><VisionMission /><CorporateValues /><Team /></main>;
}
