"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Box, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#030712] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="relative"
        >
          <h1 className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              404
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase tracking-[0.2em]">
            Render Zone Lost
          </h2>
          <p className="max-w-md text-white/40 text-lg leading-relaxed">
            Oops! It seems you&apos;ve wandered into an unrendered sector. This
            coordinate doesn&apos;t contain any assets.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white/70 font-bold hover:bg-white/10 hover:text-white transition-all transition-all duration-300"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            Back to Home
          </Link>

          <Link
            href="/equipper"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Box className="w-5 h-5 transition-transform group-hover:scale-110" />
            Equipper Studio
          </Link>
        </motion.div>

        {/* Subtle Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/20 hover:text-white/50 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <MoveLeft className="w-3 h-3" />
            Previous Coordinate
          </button>
        </motion.div>
      </motion.div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
