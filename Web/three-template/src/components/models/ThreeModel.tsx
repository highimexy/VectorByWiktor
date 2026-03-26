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
}

export function ThreeModel({ materialType = "glass", autoRotate = true }: ThreeModelProps) {
  const { nodes } = useGLTF("/models/main/model.gltf") as unknown as GLTFResult;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && autoRotate) ref.current.rotation.y += delta * 0.8;
  });

  return (
    <group ref={ref}>
      <Center>
        <mesh geometry={nodes.Text.geometry} rotation={[-Math.PI / -2, 0, 0]}>
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
        </mesh>
      </Center>
    </group>
  );
}
