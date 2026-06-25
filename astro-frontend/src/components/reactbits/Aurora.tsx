import { motion, useReducedMotion } from 'framer-motion';

/**
 * Aurora — a reactbits-style ambient hero accent.
 * Renders soft, slowly drifting gradient blobs behind hero content.
 * Decorative only (aria-hidden) and reduced-motion safe: when the user
 * prefers reduced motion the blobs are rendered static.
 */
export default function Aurora() {
  const reduceMotion = useReducedMotion();

  const blobs = [
    {
      className: 'left-[-10%] top-[-20%] h-72 w-72',
      color: 'var(--color-primary)',
      animate: { x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] },
      duration: 14,
    },
    {
      className: 'right-[-5%] top-[10%] h-80 w-80',
      color: 'var(--color-accent)',
      animate: { x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] },
      duration: 18,
    },
    {
      className: 'bottom-[-25%] left-[20%] h-72 w-72',
      color: 'var(--color-ring)',
      animate: { x: [0, 24, 0], y: [0, -28, 0], scale: [1, 1.2, 1] },
      duration: 16,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-30 blur-3xl ${blob.className}`}
          style={{ backgroundColor: blob.color }}
          animate={reduceMotion ? undefined : blob.animate}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  );
}
