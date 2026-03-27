import { useRef, useState } from "react";
import OesyScene from "../scenes/OesyScene";
import SceneControls, { type MaterialType } from "../scenes/SceneControls";
import { useGifExport, type GifQuality, type GifResolution } from "../../utils/useGifExport";

export default function OesySlide() {
  const [bgColor, setBgColor] = useState("#0a0010");
  const [material, setMaterial] = useState<MaterialType>("chrome");
  const [autoRotate, setAutoRotate] = useState(true);
  const [gifTransparent, setGifTransparent] = useState(false);
  const [gifQuality, setGifQuality] = useState<GifQuality>("medium");
  const [gifResolution, setGifResolution] = useState<GifResolution>(480);
  const containerRef = useRef<HTMLDivElement>(null);
  const { exportGif, isRecording, phase: recordPhase, progress: recordProgress } =
    useGifExport(containerRef, "oesy.gif", bgColor, gifTransparent, gifQuality, gifResolution);

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
        onExportGif={exportGif}
        isRecording={isRecording}
        recordPhase={recordPhase}
        recordProgress={recordProgress}
        gifTransparent={gifTransparent}
        onGifTransparentChange={setGifTransparent}
        gifQuality={gifQuality}
        onGifQualityChange={setGifQuality}
        gifResolution={gifResolution}
        onGifResolutionChange={setGifResolution}
      />
    </div>
  );
}
