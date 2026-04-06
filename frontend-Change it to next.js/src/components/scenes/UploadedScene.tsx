import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { UploadedModel } from "../models/UploadedModel";
import type { MaterialType } from "./SceneControls";

interface UploadedSceneProps {
  scene: THREE.Group;
  bgColor?: string;
  materialType?: MaterialType;
  autoRotate?: boolean;
  rotateSpeed?: number;
}

export default function UploadedScene({
  scene,
  bgColor = "#0a0010",
  materialType = "original",
  autoRotate = true,
  rotateSpeed = 0.5,
}: UploadedSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
      onDoubleClick={() => controlsRef.current?.reset()}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={5} color="#ffffff" />
        <pointLight position={[-5, 3, 2]} intensity={6} color="#aaaaff" />
        <pointLight position={[3, -3, 2]} intensity={4} color="#ffffff" />
        <pointLight position={[0, -5, 3]} intensity={3} color="#ffddaa" />
        <OrbitControls ref={controlsRef} enableDamping target={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
        <UploadedModel
          scene={scene}
          materialType={materialType}
          autoRotate={autoRotate}
          rotateSpeed={rotateSpeed}
        />
      </Canvas>
    </div>
  );
}
