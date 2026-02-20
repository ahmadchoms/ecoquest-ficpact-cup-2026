"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/store/useUserStore";

// Sections
import HeroSection from "@/components/landing/HeroSection";
import TickerStrip from "@/components/landing/TickerStrip";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MissionShowcase from "@/components/landing/MissionShowcase";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const { firstVisit } = useUserStore();

  return (
    <PageWrapper>
      <HeroSection firstVisit={firstVisit} />
      <TickerStrip />
      <HowItWorksSection />
      <StatsSection />
      <FeaturesSection />
      <MissionShowcase />
      <CtaSection />
      <Footer />
    </PageWrapper>
  );
}
