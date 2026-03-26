import { useGLTF, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { MaterialType } from "../scenes/SceneControls";

function makeMaterial(type: MaterialType): THREE.Material {
  switch (type) {
    case "chrome":
      return new THREE.MeshPhysicalMaterial({
        metalness: 1,
        roughness: 0.08,
        color: new THREE.Color("#e8e8ff"),
        iridescence: 1,
        iridescenceIOR: 1.8,
        side: THREE.DoubleSide,
      });
    case "glass":
      return new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.05,
        thickness: 0.5,
        ior: 1.5,
        color: new THREE.Color("#ccccff"),
        side: THREE.DoubleSide,
      });
    case "wireframe":
      return new THREE.MeshPhysicalMaterial({
        wireframe: true,
        color: new THREE.Color("#aa66ff"),
        side: THREE.DoubleSide,
      });
  }
}

interface OesyModelProps {
  materialType?: MaterialType;
  autoRotate?: boolean;
}

export function OesyModel({ materialType = "chrome", autoRotate = true }: OesyModelProps) {
  const { scene } = useGLTF("/models/oesy/oesy.gltf");
  const ref = useRef<THREE.Group>(null);

  const material = useMemo(() => makeMaterial(materialType), [materialType]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
      }
    });
  }, [scene, material]);

  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
