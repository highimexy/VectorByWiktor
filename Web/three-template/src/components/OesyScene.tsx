import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { OesyModel } from "./OesyModel";

export default function OesyScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, -4], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: false }}
    >
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={6} color="#ffffff" />
      <pointLight position={[-5, 3, 2]} intensity={4} color="#8866ff" />
      <pointLight position={[0, -5, 3]} intensity={3} color="#ff4488" />
      <OrbitControls enableDamping target={[0, 0, 0]} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <Suspense fallback={null}>
        <OesyModel />
      </Suspense>
    </Canvas>
  );
}
