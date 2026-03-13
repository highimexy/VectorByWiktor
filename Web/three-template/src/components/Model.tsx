import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type GLTFResult = {
  nodes: { rubber_duck_toy: THREE.Mesh };
  materials: { rubber_duck_toy: THREE.MeshStandardMaterial };
};

export function Model() {
  const { nodes, materials } = useGLTF("/models/model/model.gltf") as unknown as GLTFResult;

  return (
    <mesh
      geometry={nodes.rubber_duck_toy.geometry}
      material={materials.rubber_duck_toy}
      scale={7}
    />
  );
}
