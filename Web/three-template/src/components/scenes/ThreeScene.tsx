import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { ThreeModel } from "../models/ThreeModel";

function BackgroundBlobs() {
  return (
    <>
      <mesh position={[-2.5, 1.2, -4]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#ff6b9d" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[2.5, -0.8, -4]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color="#6b9dff" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0.5, -2, -5]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="#a06bff" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-1, 2.5, -5]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#6bffe0" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[3.5, 2.5, -6]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ffb86b" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-3.5, -2, -6]}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#ff4466" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[1.5, 3.5, -7]}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color="#44ffaa" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-4, 0.5, -7]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color="#ff44ff" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[4, -2.5, -7]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#44ccff" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-1.5, -3.5, -6]}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color="#ffff44" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, -8]}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial color="#6633ff" roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, -4], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: false }}
    >
      <color attach="background" args={["#0d0d1a"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={2} color="#8060ff" />
      <OrbitControls enableDamping target={[0, 0, 0]} />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <BackgroundBlobs />
      <Suspense fallback={null}>
        <ThreeModel />
      </Suspense>
    </Canvas>
  );
}
