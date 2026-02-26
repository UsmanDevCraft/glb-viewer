"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stage,
  Center,
  Environment,
  useProgress,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SimpleGLBViewerProps {
  url: string;
}

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

function LoadingOverlay() {
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
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-[40px]"
    >
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-500">
            {Math.round(smoothProgress)}%
          </span>
        </div>
      </div>
      <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
        Loading Model
      </p>
    </motion.div>
  );
}

const SimpleGLBViewer: React.FC<SimpleGLBViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden relative shadow-2xl">
      <LoadingOverlay />
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <Stage
            intensity={0.5}
            environment="apartment"
            adjustCamera
            shadows="contact"
          >
            <Model url={url} />
          </Stage>
          <OrbitControls makeDefault enablePan={true} enableZoom={true} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Label/Overlay */}
      <div className="absolute top-6 left-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-xl">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
          3D Preview
        </span>
      </div>
    </div>
  );
};

export default SimpleGLBViewer;
