"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Code2, Cpu, Globe2, Sparkles } from "lucide-react";
import FileUploader from "../components/FileUploader";

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    console.log("File selected:", selectedFile.name);
    // Here logic for equipping the GLB can be added later
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Header/Nav */}
      <nav className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Box className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            GLB<span className="text-blue-500">View</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <a
            href="#"
            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            Docs
          </a>
          <a
            href="#"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium backdrop-blur-md"
          >
            GitHub
          </a>
        </motion.div>
      </nav>

      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Next-Gen GLB Equipper
            </span>
          </motion.div>

          {/* Hero Content */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight"
          >
            Visualize your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent bg-300% animate-gradient">
              3D Models
            </span>{" "}
            with Ease
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/50 mb-12 max-w-2xl leading-relaxed"
          >
            A high-performance, studio-grade GLB viewer built for developers.
            Seamlessly equip, inspect, and share your 3D assets in seconds.
          </motion.p>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full relative py-8"
          >
            {/* Decorative background for uploader */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-[40px] -z-10 blur-2xl" />
            <FileUploader onFileSelect={handleFileSelect} />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
          >
            {[
              {
                icon: Cpu,
                title: "Fast Rendering",
                desc: "Optimized WebGL engine for butter-smooth 60FPS performance.",
              },
              {
                icon: Globe2,
                title: "Env Lighting",
                desc: "Realistic PBR environments with dynamic HDR illumination.",
              },
              {
                icon: Code2,
                title: "Dev Friendly",
                desc: "Built with Next.js and Tailwind for effortless integration.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 text-left"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 mt-20 backdrop-blur-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-sm italic">
            &quot;Design is not just what it looks like and feels like. Design
            is how it works.&quot;
          </div>
          <div className="flex gap-8 text-sm font-medium text-white/40">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 5s linear infinite;
        }
      `}</style>
    </main>
  );
};

export default Home;
