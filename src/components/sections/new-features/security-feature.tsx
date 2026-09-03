"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, revealStagger } from "@/animation/variants";
import ScrollAnchor from "@/components/scroll-anchor";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

type SecurityGroup = {
  title: string;
  icon: string;
  mechanisms: readonly string[];
};

const securityGroups: readonly SecurityGroup[] = [
  {
    title: "Authority & access",
    icon: "/assets/security-authority.svg",
    mechanisms: [
      "Onchain governance as the ultimate decision-making and authorization layer (no msigs)",
      "Fine-grained protocol permissions",
      "Appchain-native security controls",
    ],
  },
  {
    title: "Exposure boundaries",
    icon: "/assets/security-exposure.svg",
    mechanisms: [
      "Per-asset transaction pausing",
      "Per-asset deposit, withdrawal, borrowing, and exposure limits",
      "Asset and contract whitelisting",
    ],
  },
  {
    title: "Runtime safeguards",
    icon: "/assets/security-runtime.svg",
    mechanisms: [
      "Invariant enforcement",
      "Automated circuit breakers",
      "Prioritized and partial liquidations",
      "Onchain oracle updates",
    ],
  },
  {
    title: "Continuous assurance",
    icon: "/assets/security-assurance.svg",
    mechanisms: [
      "Independent security audits",
      "Continuous fuzzing",
      "AI-assisted security analysis",
      "A top-10 Immunefi bug bounty program",
    ],
  },
] as const;

export default function SecurityFeature() {
  const [layout, setLayout] = useState<"original" | "figma">("original");

  return (
    <AnimateOnView
      className={`overflow-hidden transition-colors duration-300 ${
        layout === "figma" ? "bg-beige" : "bg-white"
      }`}
      variants={revealStagger(0.08, 18)}
      threshold={0.08}
      viewportMargin="0px 0px -10% 0px"
    >
      <section className="relative">
        <ScrollAnchor id="security" />

        <div className="relative z-30 flex justify-center px-6 pt-8 md:pt-10">
          <div
            className="inline-flex rounded-full border border-purple/10 bg-white/80 p-1 shadow-[0_12px_40px_rgba(36,14,50,0.08)] backdrop-blur-md"
            role="group"
            aria-label="Security section layout preview"
          >
            <button
              type="button"
              aria-pressed={layout === "original"}
              onClick={() => setLayout("original")}
              className={`rounded-full px-4 py-2 font-geist text-xs font-medium transition-colors md:px-5 md:text-sm ${
                layout === "original"
                  ? "bg-purple text-white"
                  : "text-purple/60 hover:text-purple"
              }`}
            >
              Original
            </button>
            <button
              type="button"
              aria-pressed={layout === "figma"}
              onClick={() => setLayout("figma")}
              className={`rounded-full px-4 py-2 font-geist text-xs font-medium transition-colors md:px-5 md:text-sm ${
                layout === "figma"
                  ? "bg-purple text-white"
                  : "text-purple/60 hover:text-purple"
              }`}
            >
              Alt layout
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {layout === "original" ? (
            <motion.div
              key="original"
              initial="initial"
              animate="visible"
              exit="exit"
              variants={layoutTransition}
            >
              <OriginalSecurityLayout />
            </motion.div>
          ) : (
            <motion.div
              key="figma"
              initial="initial"
              animate="visible"
              exit="exit"
              variants={layoutTransition}
            >
              <FigmaSecurityLayout />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </AnimateOnView>
  );
}

const layoutTransition = {
  initial: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.333, 0, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.333, 0, 0, 1] },
  },
} as const;

const securityPanelReveal = {
  initial: {
    opacity: 0,
    y: 26,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.16,
      duration: 0.62,
      ease: [0.16, 1, 0.3, 1],
      delayChildren: 0.24,
      staggerChildren: 0.055,
    },
  },
} as const;

function OriginalSecurityLayout() {
  return (
    <>
      <div className="container mx-auto w-full px-6 pt-10 md:px-[50px] md:pt-12 lg:pt-16 xl:px-16">
        <SecurityIntro className="lg:pb-9 lg:pr-[70px]" />

        <motion.div
          className="relative mt-12 grid before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-px before:w-screen before:-translate-x-1/2 before:bg-purple/15 md:grid-cols-2 lg:grid-cols-4"
          variants={revealStagger(0.06, 14)}
        >
          {securityGroups.map((group, groupIndex) => (
            <SecurityColumn
              key={group.title}
              {...group}
              groupIndex={groupIndex}
            />
          ))}
        </motion.div>
      </div>

      <SecurityPhoto />
    </>
  );
}

function FigmaSecurityLayout() {
  return (
    <div className="pt-8 md:pt-10 lg:pt-12">
      <div className="container mx-auto w-full px-6 md:px-[50px] xl:px-16">
        <SecurityIntro />
      </div>

      <div className="relative mt-10 overflow-hidden md:mt-12">
        <SecurityPhoto fillStage />

        <div className="container relative z-10 mx-auto px-6 py-20 md:px-[50px] md:py-24 xl:px-16">
          <motion.div
            className="mx-auto grid w-full max-w-[1087px] overflow-hidden rounded-[2rem] border border-purple/15 bg-white shadow-[0_30px_80px_rgba(36,14,50,0.08)] md:grid-cols-2"
            variants={securityPanelReveal}
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -5% 0px" }}
          >
            {securityGroups.map((group, groupIndex) => (
              <FigmaSecurityCell
                key={group.title}
                {...group}
                groupIndex={groupIndex}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SecurityIntro({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`mx-auto flex w-full max-w-[900px] flex-col items-center gap-5 text-center ${className}`}
      variants={revealStagger(0.12, 18)}
    >
      <motion.h2
        className="max-w-[14ch] font-gazpacho text-[2.55rem] font-medium leading-[1.06] text-purple md:text-5xl md:leading-[1.2]"
        variants={fadeUp(18)}
      >
        Security without compromise
      </motion.h2>
      <motion.p
        className="max-w-[718px] font-geist text-base leading-[1.55] text-purple-dim md:text-[1.115rem]"
        variants={fadeUp(14)}
      >
        Hydration is built around a simple principle: assume that every layer
        can fail.
        <span className="block">
          Instead of relying on a single line of defense, the protocol uses
          multiple independent protections across governance, infrastructure,
          execution, and product design.
        </span>
      </motion.p>
    </motion.div>
  );
}

function FigmaSecurityCell({
  title,
  icon,
  mechanisms,
  groupIndex,
}: SecurityGroup & { groupIndex: number }) {
  return (
    <motion.article
      className={`flex min-h-[17rem] flex-col items-center justify-center px-7 py-10 text-center md:min-h-[19.55rem] md:px-10 ${
        groupIndex < 3 ? "border-b border-purple/15" : ""
      } ${groupIndex === 0 || groupIndex === 2 ? "md:border-r" : ""} ${
        groupIndex === 2 ? "md:border-b-0" : ""
      }`}
      variants={fadeUp(12)}
    >
      <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
      <h3 className="mt-5 font-gazpacho text-[1.35rem] font-medium leading-none text-purple md:text-[1.45rem]">
        {title}
      </h3>
      <ul className="mt-6 w-full max-w-[21.5rem] space-y-3.5 text-left">
        {mechanisms.map((mechanism) => {
          const label = mechanism.replace(" (no msigs)", "");

          return (
            <li
              key={mechanism}
              className="flex items-start gap-3 font-geist text-[0.88rem] leading-[1.35] text-purple-dim"
            >
              <Image
                src="/assets/security-bullet.svg"
                alt=""
                width={10}
                height={10}
                className="mt-[0.34em] shrink-0"
                aria-hidden="true"
              />
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
}

function SecurityPhoto({ fillStage = false }: { fillStage?: boolean }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    [1, 1.065, 1.065],
  );

  return (
    <motion.div
      ref={photoRef}
      className={
        fillStage
          ? "absolute inset-0 overflow-hidden"
          : "relative aspect-[1780/635] min-h-[25rem] w-full overflow-hidden sm:min-h-[28rem]"
      }
      variants={fadeUp(16)}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          y: reducedMotion ? 0 : imageY,
          scale: reducedMotion ? 1 : imageScale,
        }}
      >
        <Image
          src="/assets/security-vending-machine.png"
          alt="A Hydration vending machine set into a concrete pavilion beside the sea"
          fill
          className={`object-cover ${
            fillStage ? "object-[44%_center]" : "object-center"
          }`}
          sizes="100vw"
        />
      </motion.div>
    </motion.div>
  );
}

function SecurityColumn({
  title,
  icon,
  mechanisms,
  groupIndex,
}: SecurityGroup & { groupIndex: number }) {
  return (
    <motion.article
      className={`min-h-[17rem] border-b border-purple/15 px-0 py-7 md:min-h-[19rem] md:px-7 lg:min-h-[388px] lg:border-b-0 ${
        groupIndex % 2 === 1 ? "md:border-l" : ""
      } ${groupIndex > 0 ? "lg:border-l" : "lg:pl-0"}`}
      variants={fadeUp(12)}
    >
      <Image src={icon} alt="" width={32} height={32} aria-hidden="true" />
      <h3 className="mt-5 w-full font-gazpacho text-[1.35rem] font-medium leading-none text-purple">
        {title}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {mechanisms.map((mechanism) => (
          <li
            key={mechanism}
            className="flex items-start gap-3 font-geist text-[0.88rem] leading-[1.35] text-purple-dim"
          >
            <Image
              src="/assets/security-bullet.svg"
              alt=""
              width={10}
              height={10}
              className="mt-[0.34em] shrink-0"
              aria-hidden="true"
            />
            <span>{mechanism}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
