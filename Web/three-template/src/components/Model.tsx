import { useGLTF } from "@react-three/drei";

export function Model() {
  const { scene } = useGLTF("/models/model.glb");
  return <primitive object={scene} />;
}
