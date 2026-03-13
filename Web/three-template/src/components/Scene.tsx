import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Model";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [3, 3, 3], fov: 60 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <OrbitControls enableDamping />
        <Grid infiniteGrid />
        <Model />
      </Suspense>
    </Canvas>
  );
}
