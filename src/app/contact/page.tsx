import type { Metadata } from "next";
import { ContactDetails, Location } from "@/components/sections/contact";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return <main id="main-content" className="elementor elementor-84"><ContactDetails /><Location /></main>;
}
