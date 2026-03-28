import * as THREE from "three";
import { useMemo, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

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
  return <primitive object={combinedScene} scale={1.5} castShadow />;
}
