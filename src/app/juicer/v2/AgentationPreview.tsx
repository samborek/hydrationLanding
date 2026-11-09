"use client";

import dynamic from "next/dynamic";

const Agentation = dynamic(
  () => import("agentation").then((module) => module.Agentation),
  { ssr: false },
);

export default function AgentationPreview({ endpoint }: { endpoint?: string }) {
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_AGENTATION_PREVIEW !== "1") return null;

  return <Agentation endpoint={endpoint} appName="Juicer V2" />;
}
