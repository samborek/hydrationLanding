"use client";

import type { StatsData } from "@/api/stats";
import Button from "@/components/ui/buttons/button";
import Paragraph from "@/components/ui/typography/paragraph";
import Socials from "@/components/footer/socials";
import SupportingBadge from "@/components/badges/supportingBadge";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";
import useScreenSize from "@/hooks/useScreenSize";
import Image from "next/image";
import HeroWaterCanvas from "./water-canvas";
import { useRef, useState } from "react";

const headlineEase = [0.2, 0.65, 0.3, 0.9] as const;
const beigeShaderColor = [246 / 255, 246 / 255, 236 / 255] as const;
const metricRevealEase = (value: number) => 1 - Math.pow(1 - value, 3);

export default function HeroSection({ stats }: { stats: StatsData }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { height: viewportHeight } = useScreenSize();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const sceneClip = useTransform(
    scrollYProgress,
    [0, 0.18],
    [
      "inset(66vh 7vw 0vh 7vw round 2.75rem 2.75rem 0rem 0rem)",
      "inset(0vh 0vw 0vh 0vw round 0rem 0rem 0rem 0rem)",
    ]
  );
  const sceneMaskTop = useTransform(
    scrollYProgress,
    [0, 0.18],
    ["66vh", "0vh"]
  );
  const sceneMaskSide = useTransform(
    scrollYProgress,
    [0, 0.18],
    ["7vw", "0vw"]
  );
  const sceneFeatherMask = useMotionTemplate`linear-gradient(to bottom, transparent ${sceneMaskTop}, black calc(${sceneMaskTop} + 26px), black calc(100% - 20px), transparent 100%), linear-gradient(to right, transparent ${sceneMaskSide}, black calc(${sceneMaskSide} + 22px), black calc(100% - ${sceneMaskSide} - 22px), transparent calc(100% - ${sceneMaskSide}))`;
  const sceneFillOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const sceneTransitionHeight = useTransform(
    scrollYProgress,
    [0, 0.16, 0.26],
    [0, 0, 72]
  );
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.13]);
  const heroContentShift = Math.min(
    56,
    14 + Math.max(0, (viewportHeight - 720) * 0.072)
  );
  const heroContentY = useTransform(
    scrollYProgress,
    [0, 0.38, 0.74],
    [14, 14, heroContentShift]
  );
  const introChromeOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.3],
    [1, 0]
  );
  const statsOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.62],
    [0, 1]
  );
  const statsY = useTransform(scrollYProgress, [0.48, 0.66], [42, 0]);

  return (
    <section
      ref={sceneRef}
      data-homepage-hero
      className="relative z-10 h-[210vh] min-h-[88rem] bg-beige lg:h-[235vh] lg:min-h-[122rem]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 z-[9] overflow-hidden bg-beige"
          style={{ opacity: reducedMotion ? 0 : sceneFillOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: reducedMotion ? 1 : sceneScale }}
          >
            <Image
              src="/assets/hero-arches-sunrise.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[54%_center]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
              style={{ backgroundSize: "640px 640px" }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 isolate overflow-hidden bg-beige"
          style={{
            clipPath: reducedMotion
              ? "inset(66vh 7vw 0 7vw round 2.75rem 2.75rem 0 0)"
              : sceneClip,
            maskImage: reducedMotion ? undefined : sceneFeatherMask,
            WebkitMaskImage: reducedMotion ? undefined : sceneFeatherMask,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: reducedMotion ? 1 : sceneScale }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55,
                duration: 1.05,
                ease: headlineEase,
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                aria-hidden="true"
              >
                <Image
                  src="/assets/hero-arches-sunrise.png"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[54%_center]"
                />
              </div>
              <HeroWaterCanvas
                className="hero-water-camera"
                showCapitalBand
                transitionColor={beigeShaderColor}
                transitionHeightPx={sceneTransitionHeight}
              />
              <div
                className="pointer-events-none absolute inset-0 z-[7] bg-[url('/noise.svg')] bg-repeat opacity-20 mix-blend-multiply grayscale"
                style={{ backgroundSize: "640px 640px" }}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-8 z-20 mx-auto px-10 md:px-[8vw]"
            style={{
              opacity: reducedMotion ? 1 : introChromeOpacity,
            }}
          >
            <motion.div
              className="flex w-full flex-col items-center gap-5 lg:flex-row lg:justify-between lg:gap-0"
              initial={
                reducedMotion ? false : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.18,
                duration: 0.7,
                ease: headlineEase,
              }}
            >
              <Socials />
              <SupportingBadge />
            </motion.div>
          </motion.div>

          <HeroCapitalStats
            stats={stats}
            progress={scrollYProgress}
            style={{
              opacity: reducedMotion ? 1 : statsOpacity,
              y: reducedMotion ? 0 : statsY,
            }}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[66vh] min-h-[34rem] items-center px-6 pt-16 md:px-[50px] md:pt-20 xl:px-16"
          style={{ y: reducedMotion ? 0 : heroContentY }}
        >
          <div className="container relative mx-auto flex min-w-0 justify-center max-xl:!px-0">
            <HeroSectionContent />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroSectionContent() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-auto flex min-w-0 w-full flex-col items-center gap-8 lg:pb-[100px] lg:pt-[150px]">
      <motion.h1
        className="w-full max-w-[19ch] min-w-0 text-balance text-center font-gazpacho text-[clamp(2.35rem,11.25vw,2.75rem)] font-medium leading-[0.92] text-purple sm:text-[76px] lg:text-[88px]"
      >
        <span className="sm:hidden">
          <AnimatedHeadlineText text="A secure" />
          <br />
          <AnimatedHeadlineText delay={0.12} text="home for" />
          <br />
          <span className="font-normal italic text-[#240E32]">
            <AnimatedHeadlineText delay={0.24} text="your onchain" />
            <br />
            <AnimatedHeadlineText delay={0.38} text="capital." />
          </span>
        </span>
        <span className="hidden sm:inline">
          <AnimatedHeadlineText text="A secure home for" />
          <br />
          <span className="font-normal italic text-[#240E32]">
            <AnimatedHeadlineText delay={0.32} text="your onchain capital." />
          </span>
        </span>
      </motion.h1>
      <motion.div
        className="w-full"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.94, duration: 0.65, ease: headlineEase }}
      >
        <Paragraph
          size="large"
          className="mx-auto w-full max-w-[46rem] min-w-0 text-balance text-center text-[20px] leading-[1.25] text-purple lg:text-[24px]"
        >
          Earn sustainable yield through strategies built on productive assets,
          enhanced by DeFi, and protected by cutting-edge security.
        </Paragraph>
      </motion.div>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.08, duration: 0.65, ease: headlineEase }}
      >
        <Button
          role="primary"
          decoration="arrow"
          action={{ href: "#strategies" }}
          className="w-[257px] rounded-[32px] bg-[#240E32] hover:bg-[#240E32] hover:opacity-90 active:bg-[#240E32] [&>div]:relative [&>div]:w-full [&>div]:justify-center [&>div>svg]:absolute [&>div>svg]:right-0"
        >
          Explore strategies
        </Button>
      </motion.div>
    </div>
  );
}

function HeroCapitalStats({
  progress,
  stats,
  style,
}: {
  progress: MotionValue<number>;
  stats: StatsData;
  style: MotionStyle;
}) {
  const metrics = [
    { title: "Total value locked", value: stats.tvl, prefix: "$" },
    { title: "Trading volume", value: stats.vol_30d, prefix: "$" },
    {
      title: "Cross-chain volume",
      value: stats.xcm_vol_30d,
      prefix: "$",
    },
    { title: "Total accounts", value: stats.accounts_count, prefix: "" },
  ] as const;

  return (
    <motion.div
      id="capital"
      className="absolute inset-x-0 bottom-0 z-30 flex min-h-[38vh] flex-col justify-end bg-transparent px-6 pb-[5vh] pt-8 text-purple md:px-[50px] lg:min-h-[40vh] lg:pb-[7vh] xl:px-0"
      style={style}
    >
      <div className="container mx-auto w-full max-xl:!px-0">
        <h2 className="text-center font-gazpacho text-lg font-medium leading-none tracking-tight text-purple md:text-[1.25rem]">
          Capital at work
        </h2>
        <div className="mt-7 grid w-full grid-cols-2 gap-x-5 gap-y-8 lg:mt-8 lg:grid-cols-4 lg:gap-10">
          {metrics.map((metric, index) => (
            <AnimatedCapitalMetric
              index={index}
              key={metric.title}
              metric={metric}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedCapitalMetric({
  index,
  metric,
  progress,
}: {
  index: number;
  metric: {
    title: string;
    value: number;
    prefix: string;
  };
  progress: MotionValue<number>;
}) {
  const reducedMotion = useReducedMotion();
  const hasLiveValue = Number.isFinite(metric.value) && metric.value > 0;
  const start = 0.56 + index * 0.02;
  const end = start + 0.33;
  const animatedValue = useTransform(
    progress,
    [start, end],
    [0, metric.value],
    { clamp: true, ease: metricRevealEase }
  );
  const metricOpacity = useTransform(progress, [start, end], [0.25, 1], {
    ease: metricRevealEase,
  });
  const metricY = useTransform(progress, [start, end], [16, 0], {
    ease: metricRevealEase,
  });
  const valueFilter = useTransform(
    progress,
    [start, end],
    ["blur(10px)", "blur(0px)"],
    { ease: metricRevealEase }
  );
  const [displayValue, setDisplayValue] = useState(() =>
    formatAnimatedMetricValue(animatedValue.get(), metric.value)
  );

  useMotionValueEvent(animatedValue, "change", (latest) => {
    const nextValue = formatAnimatedMetricValue(latest, metric.value);
    setDisplayValue((current) =>
      current === nextValue ? current : nextValue
    );
  });

  const finalValue = `${metric.prefix}${formatMetricValue(metric.value)}`;

  return (
    <motion.article
      className="min-w-0 text-center lg:text-left"
      style={{
        opacity: reducedMotion ? 1 : metricOpacity,
        y: reducedMotion ? 0 : metricY,
      }}
    >
      <motion.p
        className="font-gazpacho text-[clamp(2.75rem,7.5vw,4.125rem)] font-medium leading-[0.84] tracking-[-0.045em] text-purple lg:text-[clamp(4rem,5.4vw,5.5rem)]"
        style={{ filter: reducedMotion ? "blur(0px)" : valueFilter }}
      >
        {hasLiveValue ? (
          <>
            <span aria-hidden="true">
              {metric.prefix}
              {reducedMotion
                ? formatMetricValue(metric.value)
                : displayValue}
            </span>
            <span className="sr-only">{finalValue}</span>
          </>
        ) : (
          "—"
        )}
      </motion.p>
      <h3 className="mt-3 whitespace-nowrap font-geist text-xs font-normal leading-none tracking-tight text-purple/55 md:text-sm">
        {metric.title}
      </h3>
    </motion.article>
  );
}

function formatAnimatedMetricValue(value: number, targetValue: number) {
  if (targetValue >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}M`;
  }
  if (targetValue >= 10_000) return `${Math.round(value / 1_000)}K`;
  return Math.round(value).toString();
}

function formatMetricValue(value: number) {
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 10_000) return `${Math.round(value / 1_000)}K`;
  return Math.round(value).toString();
}

function AnimatedHeadlineText({
  className,
  delay = 0,
  letterDelay = 0.032,
  text,
  y = 18,
}: {
  className?: string;
  delay?: number;
  letterDelay?: number;
  text: string;
  y?: number;
}) {
  return (
    <motion.span aria-label={text} className={className}>
      {Array.from(text).map((letter, letterIndex) => (
        <motion.span
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: delay + letterIndex * letterDelay,
              duration: 0.45,
              ease: headlineEase,
            },
          }}
          key={`${letter}-${letterIndex}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
