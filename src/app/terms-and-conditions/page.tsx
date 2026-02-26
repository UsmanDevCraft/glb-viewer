"use client";

import { motion } from "framer-motion";
import { Gavel, Copyright, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
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
            Terms <span className="text-blue-500">of Service</span>
          </h1>
          <p className="text-white/40 text-lg">
            Last updated: February 26, 2026
          </p>
        </motion.div>

        <div className="grid gap-8">
          {[
            {
              icon: Copyright,
              title: "Respect Intellectual Property",
              content:
                "Don't steal GLB models. Users must respect the intellectual property rights of others. Assets provided by GLBView or other users are for preview and testing purposes only. Unauthorized redistribution or commercial use of assets you do not own is strictly prohibited.",
            },
            {
              icon: Gavel,
              title: "User Responsibility",
              content:
                "You are solely responsible for the content you upload to GLBView. We do not store your files on our servers, so it is your responsibility to maintain backups of your work. Ensure you have the necessary rights to use any 3D assets you upload.",
            },
            {
              icon: AlertTriangle,
              title: "No Warranty",
              content:
                "GLBView is provided 'as is' without any warranties, express or implied. We are not liable for any damages resulting from the use or inability to use our services, including but not limited to data loss or performance issues.",
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
            By using GLBView, you agree to abide by these terms. We reserve the
            right to modify these terms at any time. Continued use of the
            platform after changes constitutes acceptance of the new terms.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
