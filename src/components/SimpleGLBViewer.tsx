"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stage,
  Center,
  Environment,
} from "@react-three/drei";

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

const SimpleGLBViewer: React.FC<SimpleGLBViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden relative shadow-2xl">
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
