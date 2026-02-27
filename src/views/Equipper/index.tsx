"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, Suspense, useEffect, useCallback } from "react";
import {
  Environment,
  Grid,
  OrbitControls,
  useGLTF,
  useTexture,
  useProgress,
  useAnimations,
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
  DEFAULT_BODY_FEMALE,
  DEFAULT_BODY_MALE,
  DEFAULT_HEADS_FEMALE,
  DEFAULT_HEADS_MALE,
} from "@/src/constants/avatar_assets";

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
  animation:
    gender === "male"
      ? "/Animations/M_Standing_Idle_001.glb"
      : "/Animations/F_Standing_Idle_001.glb",
});

// ──────────────────────────────────────────────
//  Core rebinding + coloring logic
// ──────────────────────────────────────────────
function AvatarScene({
  glbAssets = {},
  preview = {},
  enableAnimation = true,
}: {
  glbAssets: MinimalAvatarProps["glbAssets"];
  preview: MinimalAvatarProps["preview"];
  enableAnimation?: boolean;
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
    animation: defaults.animation,
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

  // Helper to re-map materials for skin and eyes
  const updateMaterial = useCallback(
    (mat: THREE.Material, meshName: string = "") => {
      if (!(mat instanceof THREE.MeshStandardMaterial)) return mat;

      const matName = (mat.name || "").toLowerCase();
      const lowerMeshName = meshName.toLowerCase();

      const isSkinMesh =
        /body|skin|torso|head|face/i.test(lowerMeshName) &&
        !/eye|cornea|sclera|iris/i.test(lowerMeshName);
      const isSkinMat =
        /body|skin|torso|head|face/i.test(matName) &&
        !/eye|cornea|sclera|iris/i.test(matName);

      const isEyeMesh =
        /eye|iris|cornea|sclera/i.test(lowerMeshName) ||
        lowerMeshName.includes("wolf3d_eye");
      const isEyeMat = /eye|iris|cornea|sclera/i.test(matName);

      const newMat = mat.clone();

      if ((isSkinMesh || isSkinMat) && bodyTex) {
        newMat.map = bodyTex;
      }
      if ((isEyeMesh || isEyeMat) && eyeTex) {
        newMat.map = eyeTex;
        newMat.metalness = 0;
        newMat.roughness = 0.55;
      }

      return newMat;
    },
    [bodyTex, eyeTex],
  );

  // Combined scene (memoized → only rebuild when inputs change)
  const scene = useMemo(() => {
    // Use body as base and apply material fix
    const combined = SkeletonUtils.clone(bodyGLTF.scene) as THREE.Group;
    combined.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => updateMaterial(m, child.name))
          : updateMaterial(child.material, child.name);
        child.frustumCulled = false;
      }
    });

    // Build bone map from base body
    const bonesByName: Record<string, THREE.Bone> = {};
    combined.traverse((child) => {
      if (child instanceof THREE.Bone) {
        bonesByName[child.name] = child;
      }
    });

    // Find head bone (try common names)
    const headBone =
      bonesByName["Head"] ||
      bonesByName["Wolf3D_Head"] ||
      bonesByName["mixamorigHead"] ||
      Object.values(bonesByName).find((b) => /head/i.test(b.name));

    if (!headBone) {
      console.warn("Head bone not found – some parts may not attach properly");
    }

    const addBodyPart = (gltfScene: THREE.Group, partName: string) => {
      gltfScene.traverse((child) => {
        let resolvedPartName = partName;
        // Auto-detect sub-parts inside head GLB
        if (partName === "head") {
          // Match Wolf3D naming: Wolf3D_Eyes, Wolf3D_Teeth, Wolf3D_Head
          if (/eye/i.test(child.name) || child.name.includes("Wolf3D_Eye")) {
            resolvedPartName = "eyes";
          } else if (
            /teeth|tooth/i.test(child.name) ||
            child.name.includes("Wolf3D_Teeth")
          ) {
            resolvedPartName = "teeth";
          } else if (
            /beard|mustache|facial_hair|facialhair/i.test(child.name) ||
            child.name.includes("Wolf3D_Beard")
          ) {
            // Skip beard/mustache meshes baked into the head GLB.
            return;
          } else if (
            child.name.includes("Head") ||
            child.name.includes("Wolf3D_Head")
          ) {
            resolvedPartName = "skin";
          } else {
            resolvedPartName = "skin";
          }
        }

        if (child instanceof THREE.Mesh) {
          const clonedMesh = child.clone();

          clonedMesh.material = Array.isArray(clonedMesh.material)
            ? clonedMesh.material.map((m) => updateMaterial(m, child.name))
            : updateMaterial(clonedMesh.material, child.name);

          const isSkinned = child instanceof THREE.SkinnedMesh;

          if (isSkinned) {
            const skinnedChild = child as THREE.SkinnedMesh;
            const newBones: THREE.Bone[] = [];
            skinnedChild.skeleton.bones.forEach((bone) => {
              const templateBone = bonesByName[bone.name];
              if (templateBone) {
                newBones.push(templateBone);
              }
            });

            if (newBones.length === skinnedChild.skeleton.bones.length) {
              const newSkeleton = new THREE.Skeleton(
                newBones,
                skinnedChild.skeleton.boneInverses.map((m) => m.clone()),
              );

              const skinnedClone = clonedMesh as THREE.SkinnedMesh;
              const bindMatrixClone = skinnedChild.bindMatrix.clone();
              skinnedClone.skeleton = newSkeleton;
              skinnedClone.bind(newSkeleton, bindMatrixClone);
              skinnedClone.bindMatrixInverse.copy(bindMatrixClone).invert();
              skinnedClone.frustumCulled = false;

              if (skinnedClone.geometry.boundingSphere === null) {
                skinnedClone.geometry.computeBoundingSphere();
              }
              if (skinnedClone.geometry.boundingBox === null) {
                skinnedClone.geometry.computeBoundingBox();
              }

              skinnedClone.pose();
              skinnedClone.visible = true;

              // Attach to head bone if head part
              const isHeadPart = ["skin", "eyes", "teeth", "hair"].includes(
                resolvedPartName,
              );
              if (isHeadPart && headBone) {
                headBone.add(skinnedClone);
              } else {
                combined.add(skinnedClone);
              }
              return;
            } else {
              console.warn(
                `Bone mismatch for ${resolvedPartName} (${child.name}), adding as static`,
              );
            }
          }

          // Static attachment for non-skinned meshes
          const isHeadPart = ["skin", "eyes", "teeth", "hair"].includes(
            resolvedPartName,
          );
          clonedMesh.frustumCulled = false;
          if (isHeadPart && headBone) {
            headBone.add(clonedMesh);
          } else {
            combined.add(clonedMesh);
          }
        }
      });
    };

    // Add parts (body is already base, so start with head)
    addBodyPart(headGLTF.scene, "head");
    addBodyPart(hairGLTF.scene, "hair");
    addBodyPart(shirtGLTF.scene, "shirt");
    addBodyPart(pantsGLTF.scene, "pants");
    addBodyPart(shoesGLTF.scene, "shoes");

    return combined;
  }, [
    bodyGLTF,
    headGLTF,
    hairGLTF,
    shirtGLTF,
    pantsGLTF,
    shoesGLTF,
    updateMaterial,
  ]);

  return (
    <AnimatedCombinedScene
      key={scene.uuid}
      combinedScene={scene}
      animationPath={final.animation}
      enableAnimation={enableAnimation}
    />
  );
}

function AnimatedCombinedScene({
  combinedScene,
  animationPath,
  enableAnimation,
}: {
  combinedScene: THREE.Group;
  animationPath: string;
  enableAnimation: boolean;
}) {
  const animationGLTF = useGLTF(animationPath);
  const animationClips = useMemo(() => {
    if (!animationGLTF) return [];
    const raw = Array.isArray(animationGLTF)
      ? animationGLTF[0]?.animations
      : animationGLTF.animations;
    return Array.isArray(raw) ? raw : [];
  }, [animationGLTF]);
  const { actions, names } = useAnimations(animationClips, combinedScene);
  useEffect(() => {
    if (!enableAnimation) {
      Object.values(actions).forEach((action) => action?.stop());
      return;
    }

    if (animationClips.length > 0 && names[0]) {
      const action = actions[names[0]];
      if (action) {
        action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.5).play();
      }
    }
  }, [
    animationClips,
    names,
    actions,
    combinedScene,
    animationPath,
    enableAnimation,
  ]);
  return <primitive object={combinedScene} scale={1} castShadow />;
}

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
      // Small delay before resetting to 0 to allow fade out
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
