import { useGLTF, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type GLTFResult = {
  nodes: { Text: THREE.Mesh };
  materials: { "Material.001": THREE.MeshStandardMaterial };
};

export function Model() {
  const { nodes, materials } = useGLTF(
    "/models/model/model.gltf",
  ) as unknown as GLTFResult;
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.8;
  });

  return (
    <group ref={ref}>
      <Center>
        <mesh
          geometry={nodes.Text.geometry}
          material={materials["Material.001"]}
          rotation={[-Math.PI / -2, 0, 0]}
        />
      </Center>
    </group>
  );
}
