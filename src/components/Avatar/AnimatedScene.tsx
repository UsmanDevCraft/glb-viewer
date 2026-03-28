import { useFrame } from "@react-three/fiber";
import { useMemo, useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const BLINK_MORPH_NAMES = ["eyeBlinkLeft", "eyeBlinkRight"] as const;
const BLINK_DURATION = 0.15;
const BLINK_INTERVAL_MIN = 2;
const BLINK_INTERVAL_MAX = 4;

export function AnimatedCombinedScene({
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

  // Head mesh ref for blink (set once when scene is ready)
  const blinkMeshesRef = useRef<THREE.SkinnedMesh[]>([]);
  useEffect(() => {
    blinkMeshesRef.current = [];
    combinedScene.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        const mesh = child as THREE.SkinnedMesh;
        if (
          mesh.morphTargetDictionary &&
          (mesh.morphTargetDictionary[BLINK_MORPH_NAMES[0]] !== undefined ||
            mesh.morphTargetDictionary[BLINK_MORPH_NAMES[1]] !== undefined)
        ) {
          blinkMeshesRef.current.push(mesh);
        }
      }
    });
  }, [combinedScene]);

  // Blink state (refs to avoid re-renders)
  const blinkElapsedRef = useRef(0);
  const blinkNextAtRef = useRef(BLINK_INTERVAL_MIN);
  const blinkPhaseRef = useRef<"idle" | "closing" | "opening">("idle");
  const blinkProgressRef = useRef(0);

  useFrame((_, delta) => {
    if (blinkMeshesRef.current.length === 0) return;
    blinkElapsedRef.current += delta;
    const t = blinkElapsedRef.current;
    let influence = 0;

    switch (blinkPhaseRef.current) {
      case "idle":
        if (t >= blinkNextAtRef.current) {
          blinkPhaseRef.current = "closing";
          blinkProgressRef.current = 0;
        }
        break;
      case "closing":
        blinkProgressRef.current += delta / BLINK_DURATION;
        influence = Math.min(1, blinkProgressRef.current);
        if (blinkProgressRef.current >= 1) {
          blinkPhaseRef.current = "opening";
          blinkProgressRef.current = 0;
        }
        break;
      case "opening":
        blinkProgressRef.current += delta / BLINK_DURATION;
        influence = Math.max(0, 1 - blinkProgressRef.current);
        if (blinkProgressRef.current >= 1) {
          blinkPhaseRef.current = "idle";
          blinkNextAtRef.current =
            t +
            BLINK_INTERVAL_MIN +
            Math.random() * (BLINK_INTERVAL_MAX - BLINK_INTERVAL_MIN);
        }
        break;
    }

    blinkMeshesRef.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;
      if (!dict || !influences) return;

      const leftIdx = dict[BLINK_MORPH_NAMES[0]];
      const rightIdx = dict[BLINK_MORPH_NAMES[1]];

      if (leftIdx !== undefined) influences[leftIdx] = influence;
      if (rightIdx !== undefined) influences[rightIdx] = influence;
    });
  });

  return <primitive object={combinedScene} scale={1.55} castShadow />;
}
