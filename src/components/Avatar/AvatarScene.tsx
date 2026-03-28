"use client";

import { useMemo, useCallback } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { DEFAULT_ASSETS } from "@/src/constants/avatar_assets";
import { MinimalAvatarProps } from "@/src/types";
import { AnimatedCombinedScene } from "./AnimatedScene";

export function AvatarScene({
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
