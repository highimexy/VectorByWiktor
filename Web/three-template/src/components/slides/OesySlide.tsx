import { useRef, useState } from "react";
import OesyScene from "../scenes/OesyScene";
import SceneControls, { type MaterialType } from "../scenes/SceneControls";

export default function OesySlide() {
  const [bgColor, setBgColor] = useState("#0a0010");
  const [material, setMaterial] = useState<MaterialType>("chrome");
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "oesy-scene.png";
    a.click();
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <OesyScene bgColor={bgColor} materialType={material} autoRotate={autoRotate} />
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
