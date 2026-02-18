"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, Suspense } from "react";
import {
  Environment,
  Grid,
  OrbitControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import GenderDropdown from "./components/GenderDropdown";
import AssetEquipPanel from "./components/AssetEquipPanel";

// ──────────────────────────────────────────────
//  ↓  Define only the props you actually need
// ──────────────────────────────────────────────
interface MinimalAvatarProps {
  gender?: "male" | "female"; // required to pick defaults
  glbAssets?: {
    body?: string;
    head?: string;
    hair?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    bodyColorTexture?: string;
    eyeColorTexture?: string;
  };
  // Optional overrides / preview values (like your apparelPreview)
  preview?: {
    hair?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    bodyColorTexture?: string;
    eyeColorTexture?: string;
    body?: string;
  };
  showControls?: boolean;
  backgroundColor?: string;
}

// Default asset paths (adjust to your folder structure)
const DEFAULT_ASSETS = (gender: "male" | "female") => ({
  body:
    gender === "male"
      ? "/Body-Variants/Male/Male_Body_v04.glb"
      : "/Body-Variants/Female/Female_Body_v06.glb",
  head:
    gender === "male"
      ? "/Heads/MainHead_Mesh.glb"
      : "/Heads/MainHead_Female_v02.glb",
  hair: gender === "male" ? "/Hair/Hair.glb" : "/Hair/female_hair_76.glb",
  shirt: gender === "male" ? "/Top/Shirt.glb" : "/Top/top-tshirt-01-f.glb",
  pants:
    gender === "male" ? "/Bottom/Pants.glb" : "/Bottom/pants-casual-01-f.glb",
  shoes:
    gender === "male"
      ? "/Footwear/Shoes.glb"
      : "/Footwear/tennis-casual-01-grey-f.glb",
  bodyColorTexture: "/Skin-Color/7.png",
  eyeColorTexture:
    "https://simmingai.s3.us-east-1.amazonaws.com/simmingAssets/17633719094171700634379-1622793664-eye-04-mask-1699880622457-1700634386564.png",
});

// ──────────────────────────────────────────────
//  Core rebinding + coloring logic
// ──────────────────────────────────────────────
function AvatarScene({
  glbAssets = {},
  preview = {},
}: {
  glbAssets: MinimalAvatarProps["glbAssets"];
  preview: MinimalAvatarProps["preview"];
}) {
  const gender = useSelector((state: RootState) => state.equipper.gender);
  const customAssets = useSelector(
    (state: RootState) => state.equipper.customAssets,
  );
  const defaults = DEFAULT_ASSETS(gender);

  // Merge sources: customAssets (Redux) > preview > explicit glbAssets > defaults
  const final = {
    body: preview?.body || glbAssets.body || defaults.body,
    head: glbAssets.head || defaults.head,
    hair: preview?.hair || customAssets.hair || glbAssets.hair || defaults.hair,
    shirt:
      preview?.shirt || customAssets.shirt || glbAssets.shirt || defaults.shirt,
    pants:
      preview?.pants || customAssets.pants || glbAssets.pants || defaults.pants,
    shoes:
      preview?.shoes || customAssets.shoes || glbAssets.shoes || defaults.shoes,
    bodyColorTexture:
      preview?.bodyColorTexture ||
      glbAssets.bodyColorTexture ||
      defaults.bodyColorTexture,
    eyeColorTexture:
      preview?.eyeColorTexture ||
      glbAssets.eyeColorTexture ||
      defaults.eyeColorTexture,
  };

  // Load models
  const bodyGLTF = useGLTF(final.body);
  const headGLTF = useGLTF(final.head);
  const hairGLTF = useGLTF(final.hair);
  const shirtGLTF = useGLTF(final.shirt);
  const pantsGLTF = useGLTF(final.pants);
  const shoesGLTF = useGLTF(final.shoes);

  // Load textures (unconditional → satisfies hooks rule)
  const bodyTexRaw = useTexture(final.bodyColorTexture);
  const eyeTexRaw = useTexture(final.eyeColorTexture);

  const bodyTex = useMemo(() => {
    if (!bodyTexRaw) return null;
    const t = bodyTexRaw.clone();
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [bodyTexRaw]);

  const eyeTex = useMemo(() => {
    if (!eyeTexRaw) return null;
    const t = eyeTexRaw.clone();
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [eyeTexRaw]);

  // Combined scene (memoized → only rebuild when inputs change)
  const scene = useMemo(() => {
    const root = new THREE.Group();

    const addPart = (gltf: { scene: THREE.Group }) => {
      const model = SkeletonUtils.clone(gltf.scene) as THREE.Group;

      model.traverse((child: THREE.Object3D) => {
        if (!(child instanceof THREE.Mesh)) return;

        const mat = child.material;
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;

        const lowerName = (child.name || "").toLowerCase();
        const isSkin =
          /body|skin|torso|head|face/i.test(lowerName) &&
          !/eye|cornea|sclera/i.test(lowerName);
        const isEye =
          /eye|iris|cornea|sclera/i.test(lowerName) ||
          lowerName.includes("wolf3d_eye");

        const newMat = mat.clone();

        if (isSkin && bodyTex) {
          newMat.map = bodyTex;
        }
        if (isEye && eyeTex) {
          newMat.map = eyeTex;
          newMat.metalness = 0;
          newMat.roughness = 0.55;
        }

        child.material = newMat;
        child.frustumCulled = false;
      });

      root.add(model);
    };

    addPart(bodyGLTF);
    addPart(headGLTF);
    addPart(hairGLTF);
    addPart(shirtGLTF);
    addPart(pantsGLTF);
    addPart(shoesGLTF);

    return root;
  }, [
    bodyGLTF,
    headGLTF,
    hairGLTF,
    shirtGLTF,
    pantsGLTF,
    shoesGLTF,
    bodyTex,
    eyeTex,
  ]);

  return <primitive object={scene} />;
}

// ──────────────────────────────────────────────
//  Main exported component
// ──────────────────────────────────────────────
export default function MinimalAvatar({
  glbAssets = {},
  preview = {},
  backgroundColor = "#030712",
}: MinimalAvatarProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotationY, setRotationY] = useState(0);

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
          <Canvas
            shadows
            camera={{ position: [0, 1.4, 3.2], fov: 50 }}
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
                <AvatarScene glbAssets={glbAssets} preview={preview} />
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

        {/* Loading Overlay */}
        <Suspense
          fallback={
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="text-white/40 font-bold uppercase tracking-widest text-sm animate-pulse">
                Initializing Studio
              </p>
            </div>
          }
        >
          <div className="hidden" />
        </Suspense>
      </div>
    </div>
  );
}
