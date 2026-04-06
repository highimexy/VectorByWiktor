import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ShipModel } from "../models/ShipModel";
import type { MaterialType } from "./SceneControls";

interface ShipSceneProps {
  bgColor?: string;
  materialType?: MaterialType;
  autoRotate?: boolean;
  rotateSpeed?: number;
}

export default function ShipScene({
  bgColor = "#0a0010",
  materialType = "chrome",
  autoRotate = true,
  rotateSpeed = 0.5,
}: ShipSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
      onDoubleClick={() => controlsRef.current?.reset()}
    >
      <Canvas
        camera={{ position: [0, 0, -60], fov: 80 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.3} color="#334466" />
        <pointLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <pointLight position={[-5, 3, 2]} intensity={10} color="#2255aa" />
        <pointLight position={[3, -3, 2]} intensity={8} color="#3366cc" />
        <pointLight position={[0, 5, -2]} intensity={6} color="#4488ff" />
        <pointLight position={[0, -5, 3]} intensity={3} color="#88ccff" />
        <OrbitControls ref={controlsRef} enableDamping target={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
        <Suspense fallback={null}>
          <ShipModel
            materialType={materialType}
            autoRotate={autoRotate}
            rotateSpeed={rotateSpeed}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
