"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp } from "@/animation/variants";
import ScrollAnchor from "@/components/scroll-anchor";
import Button from "@/components/ui/buttons/button";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import SectionLabel from "@/components/ui/labels/section";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

function OnionShieldIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <path
        d="M32 9c9.5 0 18.2 4.2 23 10.9-1 19.1-9.8 29.8-23 34.9-13.2-5.1-22-15.8-23-34.9C13.8 13.2 22.5 9 32 9z"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path
        d="M21 26c4-5 8.6-7.7 11-7.7 2.4 0 7 2.7 11 7.7M18.4 35.7c4.5-3.8 8.8-5.6 13.6-5.6s9.1 1.8 13.6 5.6"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TestRigIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <path
        d="M24 10h16M28 10v9L16 43c-1 2.4.7 5 3.3 5h25.4c2.6 0 4.3-2.6 3.3-5L36 19v-9"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 36h20M25 28h14M27 44c2.2-1.8 4.4-2.7 8-2.7 2.3 0 4.1.4 5.6 1.2"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="26" cy="46" r="2.2" fill="currentColor" />
      <circle cx="37" cy="44" r="2.2" fill="currentColor" />
    </svg>
  );
}

function LockKeyIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <rect
        x="18"
        y="28"
        width="28"
        height="22"
        rx="5"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 28v-5.5A8 8 0 0 1 32 14a8 8 0 0 1 8 8.5V28"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M45 20l7 7-5 5-7-7"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="28" r="2.2" fill="currentColor" />
    </svg>
  );
}

function LimitIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <path
        d="M14 43c0-10 8.2-18 18-18s18 8 18 18"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M32 25v12l8 6"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 50h28" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="32" cy="43" r="3.8" fill="currentColor" />
    </svg>
  );
}

function BoundaryIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="6"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 24h8M24 24v8M40 40h-8M40 40v-8M40 24h-8M24 40h8"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SirenIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
      <path
        d="M23 45v-7.5c0-5 4-9.5 9-9.5s9 4.5 9 9.5V45"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path d="M18 47h28" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <path
        d="M21 23l-4-4M43 23l4-4M32 17V12M18 31h-5M51 31h-5"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="27" r="4.5" fill="currentColor" />
    </svg>
  );
}

type SecurityBentoCardConfig = {
  title: string;
  description: string;
  accent: "lavender" | "blue" | "green";
  Icon: () => JSX.Element;
  /** Flex grow weights at lg; columns share one min-height so ratios create bento silhouette */
  layoutClass: string;
};

const securityBentoColumns: readonly (readonly SecurityBentoCardConfig[])[] = [
  [
    {
      title: "Assume breach",
      description:
        "Hydration starts from the assumption that some layer will fail, so the stack is built to absorb the layer before it.",
      accent: "lavender",
      Icon: OnionShieldIcon,
      layoutClass: "lg:flex-[1.55] lg:basis-0",
    },
    {
      title: "Bound the edges",
      description:
        "XCM, the EVM, and flash-loan paths are tightly constrained so edge risk stays at the edge.",
      accent: "blue",
      Icon: BoundaryIcon,
      layoutClass: "lg:flex-[0.85] lg:basis-0",
    },
  ],
  [
    {
      title: "Test adversarially",
      description:
        "Strict review, property-based testing, invariant checks, continuous fuzzing, and active bug bounties keep constant pressure on the system.",
      accent: "blue",
      Icon: TestRigIcon,
      layoutClass: "lg:flex-[0.78] lg:basis-0",
    },
    {
      title: "Slow the blast radius",
      description:
        "Rate limiters and circuit breakers cap how quickly value can move when something goes wrong.",
      accent: "lavender",
      Icon: LimitIcon,
      layoutClass: "lg:flex-[1.62] lg:basis-0",
    },
  ],
  [
    {
      title: "No admin keys",
      description:
        "Privileged actions flow through OpenGov and scoped permissions, removing single points of failure from the control plane.",
      accent: "green",
      Icon: LockKeyIcon,
      layoutClass: "lg:flex-[1.35] lg:basis-0",
    },
    {
      title: "Recover precisely",
      description:
        "Granular pauses and targeted restrictions slow the bleeding without freezing the whole system.",
      accent: "green",
      Icon: SirenIcon,
      layoutClass: "lg:flex-[1.05] lg:basis-0",
    },
  ],
] as const;

export default function SecurityFeature() {
  return (
    <AnimateOnView
      className="bg-beige px-6 py-20 md:px-[50px] xl:px-0 lg:py-28"
      threshold={0.05}
    >
      <section className="container relative mx-auto flex w-full max-xl:!px-0 flex-col gap-14">
        <ScrollAnchor id="assume-breach" />
        <div className="mx-auto flex w-full max-w-[900px] shrink-0 flex-col gap-5">
          <SectionLabel captionClassName="text-pink" iconClassName="bg-pink">
            Security
          </SectionLabel>
          <Heading size="large" className="text-purple">
            Defense in depth.
          </Heading>
          <Paragraph size="large" className="max-w-[60ch] text-purple-dim">
            Hydration is built for adversarial markets. Every layer is designed
            around the idea that failures can happen, so the protocol focuses
            on slowing attacks, limiting damage, and keeping recovery
            controlled.
          </Paragraph>
          <Button
            role="primary"
            action={{
              href: "https://hydration.substack.com/p/assume-breach-hydrations-paranoid",
              target: "_blank",
            }}
            decoration="arrow"
          >
            Read the security post
          </Button>
        </div>

        <div className="flex w-full flex-col gap-4 lg:grid lg:min-h-[48rem] lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {securityBentoColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex min-h-0 flex-col gap-4 lg:h-full lg:min-h-0"
            >
              {column.map((card) => (
                <SecurityBentoCard key={card.title} {...card} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </AnimateOnView>
  );
}

function SecurityBentoCard({
  title,
  description,
  accent,
  Icon,
  layoutClass,
  className = "",
}: {
  title: string;
  description: string;
  accent: "lavender" | "blue" | "green";
  Icon: () => JSX.Element;
  layoutClass: string;
  className?: string;
}) {
  const accentClasses = {
    lavender: "bg-lavender/70 text-purple",
    blue: "bg-blue/55 text-purple",
    green: "bg-green/70 text-purple",
  };

  const iconChipClasses = {
    lavender: "bg-lavender/60 text-purple",
    blue: "bg-blue/60 text-purple",
    green: "bg-green/65 text-purple",
  };

  return (
    <AnimateOnView
      element="div"
      className={twMerge(
        "relative flex h-full min-h-0 max-lg:flex-none flex-col overflow-hidden rounded-[2rem] p-6 shadow-none lg:min-h-0 lg:p-7",
        accentClasses[accent],
        layoutClass,
        className
      )}
      variants={fadeUp()}
    >
      <motion.article className="flex min-h-0 flex-1 flex-col gap-4" variants={fadeUp()}>
        <div
          className={twMerge(
            "grid h-12 w-12 shrink-0 place-items-center rounded-full self-start lg:h-14 lg:w-14",
            iconChipClasses[accent]
          )}
        >
          <Icon />
        </div>
        <h3 className="max-w-[20ch] font-gazpacho text-[clamp(1.3rem,1.9vw,2.15rem)] font-medium leading-[0.95] text-purple lg:max-w-none">
          {title}
        </h3>

        <Paragraph
          size="medium"
          className="max-w-[26ch] text-[1rem] leading-[1.35] text-purple-dim lg:max-w-[28ch] lg:text-[1.05rem]"
        >
          {description}
        </Paragraph>
      </motion.article>
    </AnimateOnView>
  );
}
