"use client";

import { motion } from "framer-motion";
import { HeroVisual } from "./HeroVisual";

export function GlobeLayout() {
  return (
    <motion.div
      className="relative mx-auto min-h-[420px] w-full max-w-[680px] overflow-hidden rounded-[2rem] sm:min-h-[480px] lg:mx-0 lg:ml-auto lg:min-h-[520px]"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.1 }}
    >
      <HeroVisual />
    </motion.div>
  );
}
