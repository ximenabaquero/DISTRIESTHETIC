import { SiteNav } from "@/components/SiteNav";
import HeroSection from "./components/index/HeroSection";
import BenefitsSection from "./components/index/BenefitsSection";
import MisionVisionSection from "./components/index/MisionVisionSection";
import Footer from "./components/index/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <MisionVisionSection />
      <Footer />
    </div>
  );
}