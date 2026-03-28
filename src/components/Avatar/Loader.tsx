import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export function LoadingOverlay() {
  const { active, progress } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    if (active) {
      if (progress > smoothProgress) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSmoothProgress(progress);
      }
    } else {
      const timeout = setTimeout(() => {
        setSmoothProgress(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, active, smoothProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: active ? "auto" : "none" }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-md"
    >
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-500">
            {Math.round(smoothProgress)}%
          </span>
        </div>
      </div>
      <p className="text-white/40 font-bold uppercase tracking-widest text-sm animate-pulse">
        Buffering Assets...
      </p>
    </motion.div>
  );
}
