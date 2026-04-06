import { Center } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { MaterialType } from "../scenes/SceneControls";

function makeMaterial(type: Exclude<MaterialType, "original">): THREE.Material {
  switch (type) {
    case "chrome":
      return new THREE.MeshPhysicalMaterial({
        metalness: 1, roughness: 0.08, color: new THREE.Color("#e8e8ff"),
        iridescence: 1, iridescenceIOR: 1.8, side: THREE.DoubleSide,
      });
    case "glass":
      return new THREE.MeshPhysicalMaterial({
        transmission: 1, roughness: 0.05, thickness: 0.5, ior: 1.5,
        color: new THREE.Color("#ccccff"), side: THREE.DoubleSide,
      });
    case "wireframe":
      return new THREE.MeshPhysicalMaterial({
        wireframe: true, color: new THREE.Color("#aa66ff"), side: THREE.DoubleSide,
      });
    case "gold":
      return new THREE.MeshPhysicalMaterial({
        metalness: 1, roughness: 0.15, color: new THREE.Color("#ffcc44"),
        iridescence: 0.4, iridescenceIOR: 1.5, side: THREE.DoubleSide,
      });
    case "matte":
      return new THREE.MeshStandardMaterial({
        roughness: 0.95, metalness: 0, color: new THREE.Color("#cccccc"), side: THREE.DoubleSide,
      });
    case "neon":
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"), emissive: new THREE.Color("#00ffcc"),
        emissiveIntensity: 2.5, roughness: 1, metalness: 0, side: THREE.DoubleSide,
      });
    case "obsidian":
      return new THREE.MeshPhysicalMaterial({
        roughness: 0.02, metalness: 0.8, color: new THREE.Color("#1a1a33"),
        reflectivity: 1, side: THREE.DoubleSide,
      });
    case "hologram":
      return new THREE.MeshPhysicalMaterial({
        transmission: 0.6, roughness: 0, iridescence: 1, iridescenceIOR: 2.5,
        color: new THREE.Color("#88aaff"), metalness: 0.2, side: THREE.DoubleSide,
      });
    case "water":
      return new THREE.MeshPhysicalMaterial({
        transmission: 0.95, roughness: 0, thickness: 1.2, ior: 1.33,
        color: new THREE.Color("#44aaff"), metalness: 0, reflectivity: 1,
        envMapIntensity: 1.5, side: THREE.DoubleSide,
      });
  }
}

interface UploadedModelProps {
  scene: THREE.Group;
  materialType?: MaterialType;
  autoRotate?: boolean;
  rotateSpeed?: number;
}

export function UploadedModel({ scene, materialType = "original", autoRotate = true, rotateSpeed = 0.5 }: UploadedModelProps) {
  const { camera } = useThree();
  const ref = useRef<THREE.Group>(null);
  const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

  const material = useMemo(
    () => materialType === "original" ? null : makeMaterial(materialType as Exclude<MaterialType, "original">),
    [materialType]
  );

  // Fit camera to model bounds
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = ((camera as THREE.PerspectiveCamera).fov ?? 50) * (Math.PI / 180);
    const distance = (maxDim / (2 * Math.tan(fov / 2))) * 2;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  // Save original materials
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!originalMaterials.current.has(mesh)) {
          originalMaterials.current.set(mesh, mesh.material);
        }
      }
    });
  }, [scene]);

  // Apply / restore material
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (materialType === "original") {
          const orig = originalMaterials.current.get(mesh);
          if (orig) mesh.material = orig as THREE.Material;
        } else if (material) {
          mesh.material = material;
        }
      }
    });
  }, [scene, material, materialType]);

  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * rotateSpeed;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
