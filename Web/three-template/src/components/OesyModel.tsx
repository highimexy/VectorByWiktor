import { useGLTF, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const chromeMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 0.08,
  color: new THREE.Color("#e8e8ff"),
  iridescence: 1,
  iridescenceIOR: 1.8,
  side: THREE.DoubleSide,
});

export function OesyModel() {
  const { scene } = useGLTF("/models/oesy/oesy.gltf");
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = chromeMaterial;
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
