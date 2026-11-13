import type { Metadata } from "next";
import { ServicesHero, ServicesIntroduction, Enterprise, Cctv, Biometrics, NetworkInfrastructure, IpPhones, StructuredCabling, ElectricFence, FireDetection, Computing } from "@/components/sections/services";
export const metadata: Metadata = { title: "Product & Services" };
export default function ServicesPage() {
  return <main id="main-content" className="elementor elementor-81"><ServicesHero /><ServicesIntroduction /><Enterprise /><Cctv /><Biometrics /><NetworkInfrastructure /><IpPhones /><StructuredCabling /><ElectricFence /><FireDetection /><Computing /></main>;
}
