"use client";

import { fadeUp } from "@/animation/variants";
import { motion } from "framer-motion";
import Caption from "../typography/caption";
import { twMerge } from "tailwind-merge";
import DiamondIcon from "./icons/diamond";

type Props = {
  children: string;
  captionClassName?: string;
  iconClassName?: string;
};

export default function SectionLabel({
  children,
  captionClassName,
  iconClassName,
}: Props) {
  return (
    <motion.div
      className={twMerge("flex ~gap-1.5/2 items-center")}
      variants={fadeUp(10)}
    >
      <DiamondIcon className={twMerge("bg-lavender", iconClassName)} />
      <Caption
        className={twMerge("text-lavender ~text-sm/base", captionClassName)}
      >
        {children}
      </Caption>
    </motion.div>
  );
}
