import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import JuicerCurrent from "../JuicerCurrent";
import { getCurrentStyles } from "../current-styles";
import { site } from "@/lib/site";
import AgentationPreview from "./AgentationPreview";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Juicer V2 · Hydration",
  description: "Explore how Juicer puts your assets’ borrowing power to work and compounds eligible earnings on Hydration.",
  alternates: { canonical: "/juicer/v2" },
  openGraph: {
    type: "website",
    url: "/juicer/v2",
    title: "Juicer V2 · Hydration",
    description: "Explore how Juicer puts your assets’ borrowing power to work and compounds eligible earnings on Hydration.",
    images: ["/opengraph-image.jpg"],
  },
};

export default async function JuicerV2Page() {
  const css = await getCurrentStyles({ preserveV2Top: true });
  return (
    <div className="juicer-v2-page bg-beige text-purple [&>footer]:border-t-0">
      <link rel="preload" as="image" href="/juicer-supplied/video/orange-juice-fluid-loop-v4-poster.webp" fetchPriority="high" />
      <Header className="fixed top-0 left-0 right-0 xl:top-4" fullPageNavigation />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style dangerouslySetInnerHTML={{ __html: ".juicer-v2-page .footer-blog-cta{border-radius:9999px}" }} />
      <style dangerouslySetInnerHTML={{ __html: ".juicer-current .hero h1.hero-description{font-weight:500;font-size:clamp(52px,5.25vw,94px);max-width:1120px}@media(max-width:760px){.juicer-current .hero h1.hero-description{font-size:clamp(34px,10vw,44px);max-width:360px}}" }} />
      <div className="juicer-current"><JuicerCurrent enableYieldReveal /></div>
      <AgentationPreview endpoint={process.env.NEXT_PUBLIC_AGENTATION_PREVIEW === "1" ? "/agentation" : process.env.AGENTATION_BROWSER_ENDPOINT} />
      <Footer />
    </div>
  );
}
