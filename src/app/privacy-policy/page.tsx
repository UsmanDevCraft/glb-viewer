"use client";

import { motion } from "framer-motion";
import { Shield, Lock, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <nav className="relative z-10 container mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </nav>

      <section className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">
            Privacy <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-white/40 text-lg">
            Last updated: February 26, 2026
          </p>
        </motion.div>

        <div className="grid gap-8">
          {[
            {
              icon: Shield,
              title: "Your Data is Yours",
              content:
                "At GLBView, we believe in radical transparency and absolute privacy. We do not collect, store, or sell your personal information. Our platform is designed to be a tool, not a data harvester.",
            },
            {
              icon: Lock,
              title: "Local Processing",
              content:
                "When you upload or preview a GLB file, it stays on your machine. All 3D rendering and processing happen locally in your browser. Your assets are never sent to our servers.",
            },
            {
              icon: EyeOff,
              title: "No Tracking",
              content:
                "We don't use invasive tracking cookies. We don't follow you around the web. We only care about providing you with a great 3D viewing experience.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
              <p className="text-white/60 leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 border-t border-white/5 text-white/40 text-sm leading-relaxed"
        >
          <p>
            If you have any questions about our privacy practices, please reach
            out to us via our GitHub repository. We are committed to maintaining
            the highest standards of privacy for the 3D developer community.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
