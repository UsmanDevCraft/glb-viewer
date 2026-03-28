"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, Suspense } from "react";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import GenderDropdown from "../../components/GenderDropdown";
import AssetEquipPanel from "../../components/AssetEquipPanel";
import Dropdown from "@/src/components/Dropdown";
import {
  DEFAULT_ASSETS,
  DEFAULT_BODY_FEMALE,
  DEFAULT_BODY_MALE,
  DEFAULT_HEADS_FEMALE,
  DEFAULT_HEADS_MALE,
} from "@/src/constants/avatar_assets";
import { MinimalAvatarProps } from "@/src/types";
import { AvatarScene } from "@/src/components/Avatar/AvatarScene";
import { LoadingOverlay } from "@/src/components/Avatar/Loader";

export default function MinimalAvatar({
  glbAssets = {},
  preview = {},
  backgroundColor = "#030712",
}: MinimalAvatarProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  const gender = useSelector((state: RootState) => state.equipper.gender);
  const [prevGender, setPrevGender] = useState(gender);

  const [selectedHeadKey, setSelectedHeadKey] = useState(() => {
    const defaults = DEFAULT_ASSETS(gender);
    const headMap =
      gender === "male" ? DEFAULT_HEADS_MALE : DEFAULT_HEADS_FEMALE;
    return (
      Object.keys(headMap).find(
        (k) => headMap[k as keyof typeof headMap] === defaults.head,
      ) || ""
    );
  });
  const [selectedBodyKey, setSelectedBodyKey] = useState(() => {
    const defaults = DEFAULT_ASSETS(gender);
    const bodyMap = gender === "male" ? DEFAULT_BODY_MALE : DEFAULT_BODY_FEMALE;
    return (
      Object.keys(bodyMap).find(
        (k) => bodyMap[k as keyof typeof bodyMap] === defaults.body,
      ) || ""
    );
  });

  const headOptions = useMemo(
    () =>
      Object.keys(
        gender === "male" ? DEFAULT_HEADS_MALE : DEFAULT_HEADS_FEMALE,
      ),
    [gender],
  );
  const bodyOptions = useMemo(
    () =>
      Object.keys(gender === "male" ? DEFAULT_BODY_MALE : DEFAULT_BODY_FEMALE),
    [gender],
  );

  // Sync defaults when gender changes during render
  if (gender !== prevGender) {
    setPrevGender(gender);
    const defaults = DEFAULT_ASSETS(gender);
    const headMap =
      gender === "male" ? DEFAULT_HEADS_MALE : DEFAULT_HEADS_FEMALE;
    const bodyMap = gender === "male" ? DEFAULT_BODY_MALE : DEFAULT_BODY_FEMALE;

    const hKey = Object.keys(headMap).find(
      (k) => headMap[k as keyof typeof headMap] === defaults.head,
    );
    const bKey = Object.keys(bodyMap).find(
      (k) => bodyMap[k as keyof typeof bodyMap] === defaults.body,
    );

    setSelectedHeadKey(hKey || headOptions[0]);
    setSelectedBodyKey(bKey || bodyOptions[0]);
  }

  const currentGlbAssets = useMemo(() => {
    const headMap =
      gender === "male" ? DEFAULT_HEADS_MALE : DEFAULT_HEADS_FEMALE;
    const bodyMap = gender === "male" ? DEFAULT_BODY_MALE : DEFAULT_BODY_FEMALE;

    return {
      ...glbAssets,
      head: headMap[selectedHeadKey as keyof typeof headMap] || glbAssets.head,
      body: bodyMap[selectedBodyKey as keyof typeof bodyMap] || glbAssets.body,
    };
  }, [gender, selectedHeadKey, selectedBodyKey, glbAssets]);

  return (
    <div className="relative w-full h-screen flex bg-[#030712] overflow-hidden">
      {/* Sidebar */}
      <div className="relative z-40 h-full">
        <AssetEquipPanel />
      </div>

      <div className="relative flex-1 h-full">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        {/* Header */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-8 py-8 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-all">
                <ChevronLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest leading-none mb-1">
                  Back to Home
                </span>
                <span className="text-lg font-bold text-white tracking-tight">
                  Equipper Studio
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <GenderDropdown />

            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Live Preview
              </span>
            </div>
          </motion.div>
        </nav>

        {/* Right Selection Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-32 right-8 z-30 flex flex-col gap-6 w-64 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
        >
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
              Head Selection
            </label>
            <Dropdown
              options={headOptions}
              value={selectedHeadKey}
              onChange={setSelectedHeadKey}
              placeholder="Select Head"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
              Body Selection
            </label>
            <Dropdown
              options={bodyOptions}
              value={selectedBodyKey}
              onChange={setSelectedBodyKey}
              placeholder="Select Body"
            />
          </div>

          <div className="w-full h-px bg-white/10 my-1" />

          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">
                Animations
              </span>
              <span className="text-[10px] text-white/30">Idle movement</span>
            </div>
            <button
              onClick={() => setIsAnimationEnabled(!isAnimationEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                isAnimationEnabled ? "bg-blue-500" : "bg-white/10"
              }`}
            >
              <motion.div
                animate={{ x: isAnimationEnabled ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                {isAnimationEnabled ? (
                  <Play className="w-2 h-2 text-blue-500 fill-current" />
                ) : (
                  <Pause className="w-2 h-2 text-white/40 fill-current" />
                )}
              </motion.div>
            </button>
          </div>
        </motion.div>

        {/* Camera Controls Panel */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
          >
            <button
              onClick={() => setRotationY(rotationY - 45)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/50 hover:text-white"
              title="Rotate Left"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRotationY(rotationY + 45)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/50 hover:text-white"
              title="Rotate Right"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className={`p-3 rounded-2xl transition-all ${
                isZoomed
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "hover:bg-white/10 text-white/50 hover:text-white"
              }`}
              title="Toggle Zoom"
            >
              {isZoomed ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => {
                setRotationY(0);
                setIsZoomed(false);
              }}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/50 hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10">
          <LoadingOverlay />
          <Canvas
            shadows
            camera={{ position: [0, 1.8, 4.2], fov: 55 }}
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          >
            <color attach="background" args={[backgroundColor]} />
            <ambientLight intensity={0.6} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1.5}
              castShadow
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />

            <Environment preset="apartment" />

            <Suspense fallback={null}>
              <group rotation={[0, (rotationY * Math.PI) / 180, 0]}>
                <AvatarScene
                  glbAssets={currentGlbAssets}
                  preview={preview}
                  enableAnimation={isAnimationEnabled}
                />
              </group>
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 1.8}
              makeDefault
            />

            <Grid
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={1}
              cellColor="#1e293b"
              sectionSize={2}
              sectionThickness={1.5}
              sectionColor="#3b82f6"
              fadeDistance={25}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
              position={[0, -0.01, 0]}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
