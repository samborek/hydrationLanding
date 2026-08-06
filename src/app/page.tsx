import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { fetchStats } from "@/api/stats";
import HeroSection from "@/components/sections/hero/section";
import SecurityFeature from "@/components/sections/new-features/security-feature";
import {
  CommunityBuildSection,
  HdxSection,
  IntegratedSystemSection,
  ProductiveYieldSection,
  StrategiesSection,
} from "@/components/sections/homepage-v3/sections";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration | A secure home for onchain capital",
  description:
    "Earn sustainable yield through productive onchain assets, curated DeFi strategies, and appchain-native security.",
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
        alt: "Hydration | A secure home for onchain capital",
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
        alt: "Hydration | A secure home for onchain capital",
      },
    ],
  },
};

export default async function Home() {
  const stats = await fetchStats();

  return (
    <main className="bg-white-100 overflow-x-clip">
      <Header className="fixed top-0 left-0 right-0 xl:top-4" />
      <HeroSection stats={stats} />
      <ProductiveYieldSection />
      <StrategiesSection />
      <IntegratedSystemSection />
      <SecurityFeature />
      <HdxSection />
      <CommunityBuildSection />
      <Footer />
    </main>
  );
}
