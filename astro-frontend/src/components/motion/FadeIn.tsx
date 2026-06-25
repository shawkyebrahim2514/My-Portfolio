import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Vertical offset (px) the element travels in from. */
  y?: number;
  className?: string;
}

/**
 * Fades + slides its children into view once.
 * When the user prefers reduced motion, the movement is dropped and the
 * content simply appears (no transform, no opacity flash that hides content).
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
