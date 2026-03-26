import { useRef, useState } from "react";
import ThreeScene from "../scenes/ThreeScene";
import SceneControls, { type MaterialType } from "../scenes/SceneControls";

export default function ThreeSlide() {
  const [bgColor, setBgColor] = useState("#0d0d1a");
  const [material, setMaterial] = useState<MaterialType>("glass");
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "three-scene.png";
    a.click();
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <ThreeScene bgColor={bgColor} materialType={material} autoRotate={autoRotate} />
      <SceneControls
        bgColor={bgColor}
        onBgColorChange={setBgColor}
        material={material}
        onMaterialChange={setMaterial}
        autoRotate={autoRotate}
        onAutoRotateChange={setAutoRotate}
        onScreenshot={handleScreenshot}
      />
    </div>
  );
}
