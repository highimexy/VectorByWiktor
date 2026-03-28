import { useGLTF, Center, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { MaterialType } from "../scenes/SceneControls";

type GLTFResult = {
  nodes: { Text: THREE.Mesh };
  materials: { "Material.001": THREE.MeshStandardMaterial };
};

interface ThreeModelProps {
  materialType?: MaterialType;
  autoRotate?: boolean;
  rotateSpeed?: number;
}

export function ThreeModel({ materialType = "original", autoRotate = true, rotateSpeed = 0.5 }: ThreeModelProps) {
  const { nodes } = useGLTF("/models/main/model.gltf") as unknown as GLTFResult;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * rotateSpeed;
  });

  return (
    <group ref={ref}>
      <Center>
        <mesh geometry={nodes.Text.geometry} rotation={[-Math.PI / -2, 0, 0]}>
          {materialType === "original" && (
            <primitive object={nodes.Text.material} attach="material" />
          )}
          {materialType === "glass" && (
            <MeshTransmissionMaterial
              transmission={1}
              roughness={0.05}
              thickness={0.8}
              ior={1.5}
              chromaticAberration={0.08}
              anisotropy={0.1}
              distortion={0.15}
              distortionScale={0.3}
              temporalDistortion={0.1}
              color="#ffffff"
              backside={true}
              samples={16}
            />
          )}
          {materialType === "chrome" && (
            <meshPhysicalMaterial
              metalness={1}
              roughness={0.08}
              color="#e8e8ff"
              iridescence={1}
              iridescenceIOR={1.8}
            />
          )}
          {materialType === "wireframe" && (
            <meshStandardMaterial wireframe color="#6b9dff" />
          )}
          {materialType === "gold" && (
            <meshPhysicalMaterial
              metalness={1}
              roughness={0.15}
              color="#ffcc44"
              iridescence={0.4}
              iridescenceIOR={1.5}
            />
          )}
          {materialType === "matte" && (
            <meshStandardMaterial roughness={0.95} metalness={0} color="#cccccc" />
          )}
          {materialType === "neon" && (
            <meshStandardMaterial
              color="#000000"
              emissive="#00ffcc"
              emissiveIntensity={2.5}
              roughness={1}
              metalness={0}
            />
          )}
          {materialType === "obsidian" && (
            <meshPhysicalMaterial
              roughness={0.02}
              metalness={0.8}
              color="#1a1a33"
              reflectivity={1}
            />
          )}
          {materialType === "hologram" && (
            <meshPhysicalMaterial
              transmission={0.6}
              roughness={0}
              iridescence={1}
              iridescenceIOR={2.5}
              color="#88aaff"
              metalness={0.2}
            />
          )}
          {materialType === "water" && (
            <meshPhysicalMaterial
              transmission={0.95}
              roughness={0}
              thickness={1.2}
              ior={1.33}
              color="#44aaff"
              metalness={0}
              reflectivity={1}
              envMapIntensity={1.5}
            />
          )}
        </mesh>
      </Center>
    </group>
  );
}
