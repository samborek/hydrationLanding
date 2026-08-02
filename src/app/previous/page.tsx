import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import HomepageVersionTabs from "@/components/homepage-version-tabs";
import BringYourOwnGasSection from "@/components/sections/bring-your-own-gas/section";
import BuiltToBeUnstoppableSection from "@/components/sections/built-to-be-unstoppable/section";
import DevsAndSecuritySection from "@/components/sections/devs-and-security/section";
import EffectiveTradingSection from "@/components/sections/efficient-trading/section";
import EmpoweringDaosSection from "@/components/sections/empowering-daos/section";
import LegacyHeroSection from "@/components/sections/hero/legacy-section";
import LiquidityIncentivesSection from "@/components/sections/liquidity-incentives/section";
import NewFeaturesSection from "@/components/sections/new-features/section";
import RecentPostsSection from "@/components/sections/recent-posts/section";
import Stats from "@/components/stats/stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration | Finance made efficient",
  description:
    "Hydration unites swaps, lending and the Hollar stablecoin under the roof of a scalable appchain.",
};

export default function PreviousHomepage() {
  return (
    <main className="overflow-x-hidden bg-white-100">
      <Header
        className="fixed left-0 right-0 top-0 xl:top-4"
        version="previous"
      />
      <LegacyHeroSection />
      <Stats />
      <RecentPostsSection />
      <NewFeaturesSection />
      <BringYourOwnGasSection />
      <EffectiveTradingSection />
      <LiquidityIncentivesSection />
      <BuiltToBeUnstoppableSection />
      <EmpoweringDaosSection />
      <DevsAndSecuritySection />
      <Footer version="previous" />
      <HomepageVersionTabs active="previous" />
    </main>
  );
}
