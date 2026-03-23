import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Model";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <OrbitControls enableDamping target={[0, 0, 0]} />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
