'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Re-mounts on navigation: clean, elegant room cross-fade with zero vertical shift. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
