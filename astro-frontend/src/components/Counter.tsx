import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Interactive island. Hover/tap scale effects mirror the legacy
 * ThemeContext buttonEffects (hover 1.05, active 0.95), now driven by
 * Framer Motion and disabled under prefers-reduced-motion.
 */
export default function Counter() {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="inline-flex items-center justify-center gap-xs rounded-md border border-border bg-primary px-md py-xs font-medium text-primary-contrast shadow-md"
    >
      Count: {count}
    </motion.button>
  );
}
