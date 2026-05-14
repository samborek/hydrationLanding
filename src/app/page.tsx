import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import BringYourOwnGasSection from "@/components/sections/bring-your-own-gas/section";
import BuiltToBeUnstoppableSection from "@/components/sections/built-to-be-unstoppable/section";
import DevsAndSecuritySection from "@/components/sections/devs-and-security/section";
import EffectiveTradingSection from "@/components/sections/efficient-trading/section";
import EmpoweringDaosSection from "@/components/sections/empowering-daos/section";
import HeroSection from "@/components/sections/hero/section";
import LiquidityIncentivesSection from "@/components/sections/liquidity-incentives/section";
import NewFeaturesSection from "@/components/sections/new-features/section";
import RecentPostsSection from "@/components/sections/recent-posts/section";
import Stats from "@/components/stats/stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration | Finance made efficient",
  description:
    "Hydration unites swaps, lending and the Hollar stablecoin under the roof of a scalable appchain.",
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
      url: "/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      url: "/site.webmanifest",
    },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#e53e76",
      url: "/safari-pinned-tab.svg",
    },
  ],
  //   <meta name="theme-color" content="#F6F6EC">
  // <meta name="msapplication-navbutton-color" content="#F6F6EC">
  // <meta name="apple-mobile-web-app-capable" content="yes"/>
  // <meta name="apple-mobile-web-app-status-bar-style" content="#F6F6EC"></meta>
  other: {
    "msapplication-TileColor": "#ff0000",
    "theme-color": "#ffffff",
    "color-scheme": "only light",
    "msapplication-navbutton-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar": "#ffffff",
    "apple-mobile-web-app-status-bar-style": "#ffffff",
  },
  metadataBase: new URL("https://hydration.net"),
  openGraph: {
    images: [
      {
        url: "https://hydration.net/opengraph-image.jpg",
        protocol: "https",
        hostname: "hydration.net",
        width: 1200,
        height: 627,
        alt: "Hydration | Finance made efficient",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://hydration.net/twitter-image.png",
        protocol: "https",
        hostname: "hydration.net",
        width: 1200,
        height: 627,
        alt: "Hydration | Finance made efficient",
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="bg-white-100 overflow-x-hidden">
      <Header className="fixed top-0 left-0 right-0 xl:top-4" />
      <HeroSection />
      <Stats />
      <RecentPostsSection />
      <NewFeaturesSection />
      <BringYourOwnGasSection />
      <EffectiveTradingSection />
      <LiquidityIncentivesSection />
      <BuiltToBeUnstoppableSection />
      <EmpoweringDaosSection />
      <DevsAndSecuritySection />
      <Footer />
    </main>
  );
}
