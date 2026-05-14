"use client";

import Paragraph from "@/components/ui/typography/paragraph";
import Button from "@/components/ui/buttons/button";
import Socials from "@/components/footer/socials";
import SupportingBadge from "@/components/badges/supportingBadge";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import LetterByLetter from "@/components/animation/LetterByLetter";
import { delayChildren, staggerChildren } from "@/animation/variants";
import AnimateOnView from "@/animation/motion-section";
import useScreenSize from "@/hooks/useScreenSize";

export default function HeroSection() {
  return (
    <AnimateOnView className="relative overflow-hidden lg:min-h-[820px]">
      <div
        style={{
          inset: 0,
          pointerEvents: "none",
          backgroundRepeat: "repeat",
          backgroundImage: "url(/noise.svg)",
          position: "absolute",
          zIndex: 6,
          mixBlendMode: "multiply",
          opacity: 1,
          filter: "grayscale(1)",
        }}
      ></div>
      <div
        className="absolute inset-0 z-[7] pointer-events-none bg-[url('/noise.svg')] bg-repeat opacity-45 mix-blend-overlay"
        aria-hidden="true"
      />
      <video
        className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center brightness-105 blur-[2px]"
        src="/hero-bg.mp4"
        poster="/hero-hq.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[52%] bg-gradient-to-t from-purple/45 via-purple/15 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_0%,black_35%,rgba(0,0,0,0.72)_64%,transparent_100%)]"
        aria-hidden="true"
      />
      <div className="relative z-20 lg:min-h-[820px]">
        <div className="container mx-auto flex justify-between relative lg:min-h-[820px]">
          <HeroSectionContent />
          <motion.div
            className="absolute left-0 right-0 mx-auto container bottom-4 lg:bottom-[2.375rem] gap-[3.25rem] lg:gap-0 flex flex-col items-center lg:flex-row justify-between"
            variants={delayChildren(0.75)}
          >
            <Socials />
            <SupportingBadge />
          </motion.div>
        </div>
      </div>
    </AnimateOnView>
  );
}

function HeroSectionContent() {
  const [index, setIndex] = useState(0);
  const [intervalStarted, setIntervalStarted] = useState(false);

  const { width: screenWidth } = useScreenSize();

  const texts = useMemo(() => {
    if (screenWidth < 1024) {
      return [
        { value: "efficient", translateX: 0, waitAfter: 4000 },
        { value: "simple", translateX: 0, waitAfter: 4000 },
      ];
    }
    return [
      { value: "efficient", translateX: 0, waitAfter: 3000 },
      { value: "simple", translateX: 0, waitAfter: 3000 },
      { value: "unstoppable.", translateX: 0, waitAfter: 5000 },
    ];
  }, [screenWidth]);

  useEffect(() => {
    if (!intervalStarted) return;
    const { waitAfter } = texts[index % texts.length];
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      waitAfter
    );
    return () => clearTimeout(intervalId);
  }, [intervalStarted, index, texts]);

  const LastWord = useCallback(() => {
    const current = texts[index % texts.length];
    return (
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ translateX: current.translateX }}
        className=" w-full justify-end font-gazpacho absolute inset-0 overflow-hidden"
      >
        {current.value.split("").map((char, index) => (
          <motion.span key={index} className="inline-block">
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  }, [index, texts]);

  return (
    <div className="flex flex-col justify-center items-center mx-auto ~pt-[10.5rem]/[15.938rem] pb-[13.438rem] lg:pb-[11.625rem] gap-8 w-full">
      <motion.section
        className="font-gazpacho w-full"
        variants={staggerChildren()}
        onAnimationComplete={() => {
          setIntervalStarted(true);
          //  setTimeout(() => setIndex(1), 500);
        }}
      >
        <div className="block mx-auto ~text-[4.375rem]/[5.315rem] text-purple text-center font-medium ~leading-[3.969rem]/[4.76rem] lg:w-[430px]">
          <LetterByLetter>Finance</LetterByLetter>
        </div>
        <span className="block mx-auto ~text-[2.5rem]/[3rem] text-purple text-center italic ~leading-[3.969rem]/[4.76rem] lg:w-[430px]">
          <LetterByLetter>made</LetterByLetter>
        </span>
        <span className="block ~text-[4.375rem]/[5.315rem] text-purple text-center  font-medium justify-self-end ~leading-[3.969rem]/[4.76rem] relative h-[1em] w-full">
          {intervalStarted ? (
            <AnimatePresence initial={false} mode="sync">
              <LastWord key={index} />
            </AnimatePresence>
          ) : (
            <div
              style={{
                translate: screenWidth < 1024 ? 0 : 0,
              }}
            >
              <LetterByLetter>{texts[0].value}</LetterByLetter>
            </div>
          )}
        </span>
      </motion.section>
      <Paragraph
        size="large"
        className="text-purple text-center max-w-[430px] lg:w-[430px]"
      >
        Hydration unites swaps, lending and the Hollar stablecoin under the roof
        of a scalable appchain.
      </Paragraph>
      <Button
        role="primary"
        decoration="arrow"
        action={{ href: "https://app.hydration.net", target: "_blank" }}
      >
        Launch App
      </Button>
    </div>
  );
}
