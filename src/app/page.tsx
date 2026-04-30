import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import StatsSection from "@/components/sections/StatsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <PortfolioSection />
      <TechStackSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
