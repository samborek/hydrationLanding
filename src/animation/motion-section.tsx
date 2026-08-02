import { ReactNode } from "react";
import { Variants, motion } from "framer-motion";

export type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  element?: "section" | "div" | "article";
  alwaysVisible?: boolean;
  variants?: Variants;
  style?: React.CSSProperties;
  threshold?: number;
};

export default function AnimateOnView({
  children,
  className,
  element = "section",
  alwaysVisible = false,
  variants,
  style,
  threshold = 0.5,
}: MotionSectionProps) {
  const props = {
    className,
    initial: alwaysVisible ? "visible" : "initial",
    animate: alwaysVisible ? "visible" : undefined,
    whileInView: alwaysVisible ? undefined : "visible",
    viewport: { once: true, amount: threshold },
    variants,
    style,
  };
  if (element === "div") {
    return <motion.div {...props}>{children}</motion.div>;
  }
  return <motion.section {...props}>{children}</motion.section>;
}
