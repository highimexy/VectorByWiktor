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
    case "gold":
      return new THREE.MeshPhysicalMaterial({
        metalness: 1,
        roughness: 0.15,
        color: new THREE.Color("#ffcc44"),
        iridescence: 0.4,
        iridescenceIOR: 1.5,
        side: THREE.DoubleSide,
      });
    case "matte":
      return new THREE.MeshStandardMaterial({
        roughness: 0.95,
        metalness: 0,
        color: new THREE.Color("#cccccc"),
        side: THREE.DoubleSide,
      });
    case "neon":
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        emissive: new THREE.Color("#00ffcc"),
        emissiveIntensity: 2.5,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      });
    case "obsidian":
      return new THREE.MeshPhysicalMaterial({
        roughness: 0.02,
        metalness: 0.8,
        color: new THREE.Color("#1a1a33"),
        reflectivity: 1,
        side: THREE.DoubleSide,
      });
    case "hologram":
      return new THREE.MeshPhysicalMaterial({
        transmission: 0.6,
        roughness: 0,
        iridescence: 1,
        iridescenceIOR: 2.5,
        color: new THREE.Color("#88aaff"),
        metalness: 0.2,
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
