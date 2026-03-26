import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { OesyModel } from "../models/OesyModel";
import type { MaterialType } from "./SceneControls";

interface OesySceneProps {
  bgColor?: string;
  materialType?: MaterialType;
  autoRotate?: boolean;
}

export default function OesyScene({
  bgColor = "#0a0010",
  materialType = "chrome",
  autoRotate = true,
}: OesySceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, -10], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: false, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.3} color="#6633cc" />
      <pointLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
      <pointLight position={[-5, 3, 2]} intensity={10} color="#8833ff" />
      <pointLight position={[3, -3, 2]} intensity={8} color="#aa44ff" />
      <pointLight position={[0, 5, -2]} intensity={6} color="#cc66ff" />
      <pointLight position={[0, -5, 3]} intensity={3} color="#ff4488" />
      <OrbitControls enableDamping target={[0, 0, 0]} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <Suspense fallback={null}>
        <OesyModel materialType={materialType} autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  );
}
