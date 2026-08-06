"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, revealStagger } from "@/animation/variants";
import ScrollAnchor from "@/components/scroll-anchor";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import SectionLabel from "@/components/ui/labels/section";
import { motion } from "framer-motion";

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

type SecurityGroup = {
  title: string;
  accentClassName: string;
  Icon: () => JSX.Element;
  mechanisms: readonly string[];
};

const securityGroups: readonly SecurityGroup[] = [
  {
    title: "Authority & access",
    accentClassName: "text-[#B66BD6]",
    Icon: LockKeyIcon,
    mechanisms: [
      "Onchain governance as the ultimate decision-making and authorization layer",
      "Fine-grained protocol permissions",
      "Appchain-native security controls",
    ],
  },
  {
    title: "Exposure boundaries",
    accentClassName: "text-[#4B8FD3]",
    Icon: LimitIcon,
    mechanisms: [
      "Per-asset transaction pausing",
      "Per-asset deposit, withdrawal, borrowing, and exposure limits",
      "Asset and contract whitelisting",
    ],
  },
  {
    title: "Runtime safeguards",
    accentClassName: "text-[#6F8F48]",
    Icon: SirenIcon,
    mechanisms: [
      "Invariant enforcement",
      "Automated circuit breakers",
      "Prioritized and partial liquidations",
      "Onchain oracle updates",
    ],
  },
  {
    title: "Continuous assurance",
    accentClassName: "text-pink",
    Icon: TestRigIcon,
    mechanisms: [
      "Independent security audits",
      "Continuous fuzzing",
      "AI-assisted security analysis",
      "A top-10 Immunefi bug bounty program",
    ],
  },
] as const;

export default function SecurityFeature() {
  return (
    <AnimateOnView
      className="bg-beige px-6 py-16 md:px-[50px] xl:px-0 lg:py-24"
      variants={revealStagger(0.1, 20)}
      threshold={0.08}
      viewportMargin="0px 0px -10% 0px"
    >
      <section className="container relative mx-auto flex w-full max-xl:!px-0 flex-col gap-10 lg:gap-12">
        <ScrollAnchor id="security" />
        <motion.div
          className="mx-auto flex w-full max-w-[900px] shrink-0 flex-col gap-5"
          variants={fadeUp(14)}
        >
          <SectionLabel captionClassName="text-pink" iconClassName="bg-pink">
            Security without compromise
          </SectionLabel>
          <Heading size="large" className="text-purple">
            Defense in depth
          </Heading>
          <Paragraph size="large" className="max-w-[60ch] text-purple-dim">
            Hydration is built around a simple principle: assume that every
            layer can fail. Instead of relying on a single line of defense, the
            protocol uses multiple independent protections across governance,
            infrastructure, execution, and product design.
          </Paragraph>
        </motion.div>

        <motion.div
          className="relative grid w-full md:grid-cols-2 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-purple/15 md:after:absolute md:after:inset-x-0 md:after:top-1/2 md:after:h-px md:after:bg-purple/15"
          initial="initial"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08, margin: "0px 0px -8% 0px" }}
          variants={revealStagger(0.045, 18)}
        >
          {securityGroups.map((group) => (
            <SecurityGroupCard key={group.title} {...group} />
          ))}
        </motion.div>
      </section>
    </AnimateOnView>
  );
}

function SecurityGroupCard({
  title,
  accentClassName,
  Icon,
  mechanisms,
}: {
  title: string;
  accentClassName: string;
  Icon: () => JSX.Element;
  mechanisms: readonly string[];
}) {
  return (
    <motion.article
      className="relative border-b border-purple/15 py-8 last:border-b-0 md:min-h-[22rem] md:border-0 md:p-9 lg:min-h-[21rem] lg:p-11"
      variants={fadeUp(12)}
    >
      <div className="flex items-center gap-4 md:gap-5">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center [&_svg]:h-11 [&_svg]:w-11 ${accentClassName}`}
        >
          <Icon />
        </div>
        <h3 className="font-geist text-[0.8rem] font-semibold uppercase leading-none tracking-[0.14em] text-purple md:text-[0.85rem]">
          {title}
        </h3>
      </div>
      <ul className="mt-6 divide-y divide-purple/10 border-y border-purple/10 md:mt-7">
        {mechanisms.map((mechanism, index) => (
          <li
            key={mechanism}
            className="flex max-w-[31rem] items-start gap-4 py-3.5 md:gap-5 md:py-4"
          >
            <span
              className={`mt-[0.32em] w-5 shrink-0 font-geist text-[0.68rem] font-semibold leading-none tracking-[0.12em] ${accentClassName}`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-gazpacho text-[1.12rem] font-medium leading-[1.12] text-purple md:text-[1.22rem]">
              {mechanism}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
